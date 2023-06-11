// #include <assert.h>
// #include <stdio.h>
// #include <X11/Xlib.h>
// #include <X11/X.h>
// #include <X11/Xutil.h>
// #include <X11/extensions/shape.h>
// #include <X11/extensions/Xfixes.h>

// #include <cairo.h>
// #include <cairo-xlib.h>
// #include <iostream>
// #include <chrono>
// #include <thread>

// void draw(cairo_t *cr) {
//     cairo_set_source_rgba(cr, 1.0, 0.0, 0.0, 0.5);
//     cairo_rectangle(cr, 0, 0, 100, 200);
//     cairo_fill(cr);
// }

// void myDraw(cairo_t *cr){
// 	cairo_save(cr);
// 	cairo_set_source_rgba(cr, 0.0, 0.0, 0.0, 0.0);
// 	cairo_set_operator (cr, CAIRO_OPERATOR_SOURCE);
//     cairo_rectangle(cr, 0, 0, 1920, 1080);
//     cairo_fill(cr);
//     cairo_restore (cr);
// }

// int main() {
//     Display *d = XOpenDisplay(NULL);
//     Window root = DefaultRootWindow(d);
//     int default_screen = XDefaultScreen(d);

//     // these two lines are really all you need
//     XSetWindowAttributes attrs;
//     attrs.override_redirect = true;

//     XVisualInfo vinfo;
//     if (!XMatchVisualInfo(d, DefaultScreen(d), 32, TrueColor, &vinfo)) {
//         printf("No visual found supporting 32 bit color, terminating\n");
//     }
//     // these next three lines add 32 bit depth, remove if you dont need and change the flags below
//     attrs.colormap = XCreateColormap(d, root, vinfo.visual, AllocNone);
//     attrs.background_pixel = 0;
//     attrs.border_pixel = 0;

//     Window overlay = XCreateWindow(
//         d, root,
//         0, 0, 1920, 1080, 0,
//         vinfo.depth, InputOutput, 
//         vinfo.visual,
//         CWOverrideRedirect | CWColormap | CWBackPixel | CWBorderPixel, &attrs
//     );

//     XMapWindow(d, overlay);


//     XRectangle rect;
// 	XserverRegion region = XFixesCreateRegion(d, &rect, 1);
// 	XFixesSetWindowShapeRegion(d, overlay, ShapeInput, 0, 0, region);
// 	XFixesDestroyRegion(d, region);

//     cairo_surface_t* surf = cairo_xlib_surface_create(d, overlay,
//                                   vinfo.visual,
//                                   1920, 1080);
//     cairo_t* cr = cairo_create(surf);

//     draw(cr);
//     XFlush(d);

//     // show the window for 10 seconds
//     std::this_thread::sleep_for(std::chrono::milliseconds(10000));
//     myDraw(cr);
//     XFlush(d);
//     std::this_thread::sleep_for(std::chrono::milliseconds(10000));
// 	draw(cr);
//     XFlush(d);
//     std::this_thread::sleep_for(std::chrono::milliseconds(10000));

//     cairo_destroy(cr);
//     cairo_surface_destroy(surf);

//     XUnmapWindow(d, overlay);
//     XCloseDisplay(d);
//     return 0;
// }

//sg
// #include <X11/Xlib.h>
// #include<stdio.h>
// #include<unistd.h>
// #include <stdlib.h>
// #include <string.h>
// #include <iostream>
// #include <unistd.h>

// #include <X11/Xlib.h>
// #include <X11/Xutil.h>

// void mouseClick(int button)
// {
// 	Display *display = XOpenDisplay(NULL);

// 	XEvent event;
	
// 	if(display == NULL)
// 	{
// 		fprintf(stderr, "Errore nell'apertura del Display !!!\n");
// 		exit(EXIT_FAILURE);
// 	}
	
// 	memset(&event, 0x00, sizeof(event));
	
// 	event.type = ButtonPress;
// 	event.xbutton.button = button;
// 	event.xbutton.same_screen = True;
	
// 	XQueryPointer(display, RootWindow(display, DefaultScreen(display)), &event.xbutton.root, &event.xbutton.window, &event.xbutton.x_root, &event.xbutton.y_root, &event.xbutton.x, &event.xbutton.y, &event.xbutton.state);
	
// 	event.xbutton.subwindow = event.xbutton.window;
	
// 	while(event.xbutton.subwindow)
// 	{
// 		event.xbutton.window = event.xbutton.subwindow;
		
// 		XQueryPointer(display, event.xbutton.window, &event.xbutton.root, &event.xbutton.subwindow, &event.xbutton.x_root, &event.xbutton.y_root, &event.xbutton.x, &event.xbutton.y, &event.xbutton.state);
// 	}
	
// 	if(XSendEvent(display, PointerWindow, True, 0xfff, &event) == 0) fprintf(stderr, "Error\n");
	
// 	XFlush(display);
	
// 	std::cout<<"hi\n";
// 	usleep(1000000);
// 	std::cout<<"hi\n";
	
// 	event.type = ButtonRelease;
// 	event.xbutton.state = 0x100;
	
// 	if(XSendEvent(display, PointerWindow, True, 0xfff, &event) == 0) fprintf(stderr, "Error\n");
	
// 	XFlush(display);
	
// 	XCloseDisplay(display);
// }

// // void sendEvent(int scanCode, bool isPressed) {
// //     unsigned long focusedWindow;
// //     int focusRevert;
// //     int mask = isPressed ? KeyPressMask : KeyReleaseMask;

// //     XGetInputFocus(display, &focusedWindow, &focusRevert);

// //     XKeyEvent event;
// //     memset(&event, 0, sizeof(XKeyEvent));
// //     event.keycode = scanCode + 8;
// //     event.type = isPressed ? KeyPress : KeyRelease;
// //     event.root = focusedWindow;
// //     event.display = display;

// //     XSendEvent(display, focusedWindow, 1, mask, (XEvent *)&event);
// //     XSync(display, 0);
// // }

// int main(int argc,char * argv[]) {
// int i=0;
//     int x , y;
// x=atoi(argv[1]);
// y=atoi(argv[2]);
//     Display *display = XOpenDisplay(0);
//  Window root = DefaultRootWindow(display);

//     XWarpPointer(display, None, root, 0, 0, 0, 0, x, y);
//     XFlush(display);
// 	mouseClick(Button1);
// 	XFlush(display);


//     XCloseDisplay(display);
//     return 0;
// }
#include <unistd.h>
#include <X11/Xlib.h>
#include <X11/Xutil.h>
#include <iostream>
#include <cstring>
void mouseClick(int button)
{
    Display *display = XOpenDisplay(NULL);

    XEvent event;

    if(display == NULL)
    {
        std::cout << "clicking error 0" << std::endl;
        exit(EXIT_FAILURE);
    }

    memset(&event, 0x00, sizeof(event));

    event.type = ButtonPress;
    event.xbutton.button = button;
    event.xbutton.same_screen = True;

    XQueryPointer(display, RootWindow(display, DefaultScreen(display)), &event.xbutton.root, &event.xbutton.window, &event.xbutton.x_root, &event.xbutton.y_root, &event.xbutton.x, &event.xbutton.y, &event.xbutton.state);

    event.xbutton.subwindow = event.xbutton.window;

    while(event.xbutton.subwindow)
    {
        event.xbutton.window = event.xbutton.subwindow;
        XQueryPointer(display, event.xbutton.window, &event.xbutton.root, &event.xbutton.subwindow, &event.xbutton.x_root, &event.xbutton.y_root, &event.xbutton.x, &event.xbutton.y, &event.xbutton.state);
    }

    std::cout << PointerWindow << " "<< event.xbutton.window <<"\n";
    if(XSendEvent(display, PointerWindow, True, 0xfff, &event) == 0)
        std::cout << "clicking error 1" << std::endl;

    XFlush(display);

    event.type = ButtonRelease;
    event.xbutton.state = 0x100;

    if(XSendEvent(display, PointerWindow, True, 0xfff, &event) == 0)
        std::cout << "clicking error 2" << std::endl;

    XFlush(display);

    XCloseDisplay(display);
}

int main(){
	mouseClick(1);
	return 0;
}