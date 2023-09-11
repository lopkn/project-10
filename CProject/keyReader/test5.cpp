// #include <assert.h>
// #include <stdio.h>
// #include <time.h>
// #include <X11/Xlib.h>

// #include <X11/extensions/Xcomposite.h>
// #include <X11/extensions/Xfixes.h>
// #include <X11/extensions/shape.h>

// #include <cairo.h>
// #include <cairo-xlib.h>

// Display *d;
// Window overlay;
// Window root;
// int width, height;

// void
// allow_input_passthrough (Window w)
// {
//     XserverRegion region = XFixesCreateRegion (d, NULL, 0);

//     XFixesSetWindowShapeRegion (d, w, ShapeBounding, 0, 0, 0);
//     XFixesSetWindowShapeRegion (d, w, ShapeInput, 0, 0, region);

//     XFixesDestroyRegion (d, region);
// }

// void
// prep_overlay (void)
// {
//     overlay = XCompositeGetOverlayWindow (d, root);
//     allow_input_passthrough (overlay);
// }

// void draw(cairo_t *cr) {
//     int quarter_w = width / 4;
//     int quarter_h = height / 4;
//     cairo_set_source_rgb(cr, 1.0, 0.0, 0.0);
//     cairo_rectangle(cr, quarter_w, quarter_h, quarter_w * 2, quarter_h * 2);
//     cairo_fill(cr);
// }

// int main() {
//     struct timespec ts = {0, 5000000};

//     d = XOpenDisplay(NULL);

//     int s = DefaultScreen(d);
//     root = RootWindow(d, s);

//     XCompositeRedirectSubwindows (d, root, CompositeRedirectAutomatic);
//     XSelectInput (d, root, SubstructureNotifyMask);

//     width = DisplayWidth(d, s);
//     height = DisplayHeight(d, s);

//     prep_overlay();

//     cairo_surface_t *surf = cairo_xlib_surface_create(d, overlay,
//                                   DefaultVisual(d, s),
//                                   width, height);
//     cairo_t *cr = cairo_create(surf);

//     XSelectInput(d, overlay, ExposureMask);

//     draw(cr);

//     XEvent ev;
//     while(1) {
//       overlay = XCompositeGetOverlayWindow (d, root);
//       draw(cr);
//       XCompositeReleaseOverlayWindow (d, root);
//       nanosleep(&ts, NULL);
//     }

//     cairo_destroy(cr);
//     cairo_surface_destroy(surf);
//     XCloseDisplay(d);
//     return 0;
// }


#include <assert.h>
#include <stdio.h>
#include <X11/Xlib.h>
#include <X11/X.h>
#include <X11/Xutil.h>

#include <cairo.h>
#include <cairo-xlib.h>

#include <chrono>
#include <thread>

void draw(cairo_t *cr) {
    cairo_set_source_rgba(cr, 1.0, 0.0, 0.0, 0.5);
    cairo_rectangle(cr, 0, 0, 200, 200);
    cairo_fill(cr);
}

int main() {
    Display *d = XOpenDisplay(NULL);
    Window root = DefaultRootWindow(d);
    int default_screen = XDefaultScreen(d);

    // these two lines are really all you need
    XSetWindowAttributes attrs;
    attrs.override_redirect = true;

    XVisualInfo vinfo;
    if (!XMatchVisualInfo(d, DefaultScreen(d), 32, TrueColor, &vinfo)) {
        printf("No visual found supporting 32 bit color, terminating\n");
    }
    // these next three lines add 32 bit depth, remove if you dont need and change the flags below
    attrs.colormap = XCreateColormap(d, root, vinfo.visual, AllocNone);
    attrs.background_pixel = 0;
    attrs.border_pixel = 0;

    // Window XCreateWindow(
    //     Display *display, Window parent,
    //     int x, int y, unsigned int width, unsigned int height, unsigned int border_width,
    //     int depth, unsigned int class, 
    //     Visual *visual,
    //     unsigned long valuemask, XSetWindowAttributes *attributes
    // );
    Window overlay = XCreateWindow(
        d, root,
        0, 0, 200, 200, 0,
        vinfo.depth, InputOutput, 
        vinfo.visual,
        CWOverrideRedirect | CWColormap | CWBackPixel | CWBorderPixel, &attrs
    );

    XMapWindow(d, overlay);

    cairo_surface_t* surf = cairo_xlib_surface_create(d, overlay,
                                  vinfo.visual,
                                  200, 200);
    cairo_t* cr = cairo_create(surf);

    draw(cr);
    XFlush(d);

    // show the window for 10 seconds
    std::this_thread::sleep_for(std::chrono::milliseconds(10000));

    cairo_destroy(cr);
    cairo_surface_destroy(surf);

    XUnmapWindow(d, overlay);
    XCloseDisplay(d);
    return 0;
}