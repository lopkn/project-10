#include <thread>
#include <chrono>
#include <X11/Xlib.h>
#include <X11/Xutil.h>
#include <iostream>

int main() {
    // Open a connection to the X server
    Display *display = XOpenDisplay(nullptr);
    if (!display) {
        std::cerr << "Unable to open X display" << std::endl;
        return 1;
    }

    // Define the target window (you can replace this with a specific window ID)
    Window rootWindow = DefaultRootWindow(display);
    Window targetWindow = rootWindow; // Using the root window for demonstration


    int ungrab = XUngrabPointer(display, CurrentTime);

    // Grab the pointer
    int grabStatus = XGrabPointer(display, targetWindow, True,
                  // NoEventMask,
		                    PointerMotionMask | ButtonPressMask | ButtonReleaseMask,
                                   GrabModeSync, GrabModeSync,
                                   None, None, CurrentTime);

    if (grabStatus != GrabSuccess) {
        std::cerr << "Failed to grab the pointer. Error code: " << grabStatus << std::endl;
        XCloseDisplay(display);
        return 1;
    }
    XFlush(display);
    std::cout << "Pointer grabbed! Press Enter to release." << std::endl;

    // Wait for user input to release the grab
     std::this_thread::sleep_for(std::chrono::seconds(5));

     XAllowEvents(display, SyncPointer ,CurrentTime);

     std::this_thread::sleep_for(std::chrono::seconds(5));
     
     
     XAllowEvents(display, AsyncPointer ,CurrentTime);
     
     std::this_thread::sleep_for(std::chrono::seconds(5));
     std::cout << XPending(display) << std::endl;
     std::cout << XEventsQueued(display,QueuedAfterFlush) << std::endl;
     
     
     
     //int i = 0;
    //while (i < 50){
//	    i++;
//    std::cout << ".ressed." << std::endl;
//     XEvent event;
//     XNextEvent(display, &event);
//    std::cout << ".pressed." << std::endl;
//    }


    XSync(display, True);

    // Release the pointer grab
    XUngrabPointer(display, CurrentTime);
    std::cout << "Pointer released." << std::endl;

    // Close the display connection
    XCloseDisplay(display);
    return 0;
}
