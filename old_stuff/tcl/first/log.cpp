#include <X11/Xlib.h>
#include <X11/Xutil.h>
#include <iostream>
#include <cstdlib>

void logEventMasks(Display* display, Window window) {
    long eventMask = 0;
    XWindowAttributes attr;
    // Get the current event mask for the window
    XGetWindowAttributes(display, window, &attr);
    
    // Log all the event masks
    std::cout << "Event masks for window ID " << window << ":\n";
    std::cout << attr.all_event_masks << "\n";    
   // Further masks can be checked similarly
}

int main(int argc, char* argv[]) {
    if (argc != 2) {
        std::cerr << "Usage: " << argv[0] << " <window_id>" << std::endl;
        return 1;
    }

    // Convert the input window ID to a Window type
    Window window= static_cast<Window>(std::strtoull(argv[1], nullptr, 0));

    // Open a connection to the X server
    Display* display = XOpenDisplay(nullptr);
    if (display == nullptr) {
        std::cerr << "Unable to open X display" << std::endl;
        return 1;
    }

    XSelectInput(display, window,0);
    logEventMasks(display, window);

    XCloseDisplay(display);
    return EXIT_SUCCESS;
}
