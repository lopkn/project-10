#include <assert.h>
#include <stdio.h>
#include <X11/Xlib.h>
#include <X11/X.h>
#include <X11/Xutil.h>
#include <X11/extensions/shape.h>
#include <X11/extensions/Xfixes.h>

#include <cairo.h>
#include <cairo-xlib.h>
#include <iostream>
#include <chrono>
#include <thread>

void draw(cairo_t *cr) {
    cairo_set_source_rgba(cr, 1.0, 0.0, 0.0, 0.5);
    cairo_rectangle(cr, 0, 0, 100, 200);
    cairo_fill(cr);
}

void myDraw(cairo_t *cr){
	cairo_save(cr);
	cairo_set_source_rgba(cr, 0.0, 0.0, 0.0, 0.0);
	cairo_set_operator (cr, CAIRO_OPERATOR_SOURCE);
    cairo_rectangle(cr, 0, 0, 1920, 1080);
    cairo_fill(cr);
    cairo_restore (cr);
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

    Window overlay = XCreateWindow(
        d, root,
        0, 0, 1920, 1080, 0,
        vinfo.depth, InputOutput, 
        vinfo.visual,
        CWOverrideRedirect | CWColormap | CWBackPixel | CWBorderPixel, &attrs
    );

    XMapWindow(d, overlay);


    XRectangle rect;
	XserverRegion region = XFixesCreateRegion(d, &rect, 1);
	XFixesSetWindowShapeRegion(d, overlay, ShapeInput, 0, 0, region);
	XFixesDestroyRegion(d, region);

    cairo_surface_t* surf = cairo_xlib_surface_create(d, overlay,
                                  vinfo.visual,
                                  1920, 1080);
    cairo_t* cr = cairo_create(surf);

    draw(cr);
    XFlush(d);

    // show the window for 10 seconds
    std::this_thread::sleep_for(std::chrono::milliseconds(10000));
    myDraw(cr);
    XFlush(d);
    std::this_thread::sleep_for(std::chrono::milliseconds(10000));
	draw(cr);
    XFlush(d);
    std::this_thread::sleep_for(std::chrono::milliseconds(10000));

    cairo_destroy(cr);
    cairo_surface_destroy(surf);

    XUnmapWindow(d, overlay);
    XCloseDisplay(d);
    return 0;
}