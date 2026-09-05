#include <X11/Xlib.h>
#include <X11/Xutil.h>
#include <iostream>
#include <cstdlib>

int main(int argc, char* argv[]) {
    if (argc != 2) {
        std::cerr << "Usage: " << argv[0] << " <window_id>" << std::endl;
        return 1;
    }

    // Convert the input window ID to a Window type
    Window window_id = static_cast<Window>(std::strtoull(argv[1], nullptr, 0));

    // Open a connection to the X server
    Display* display = XOpenDisplay(nullptr);
    if (display == nullptr) {
        std::cerr << "Unable to open X display" << std::endl;
        return 1;
    }

    // Create an XSetWindowAttributes structure
    XSetWindowAttributes attributes;

    // Set the event mask to ignore mouse events
    attributes.event_mask = NoEventMask; // Set to NoEventMask to not process mouse events

    // Change the attributes of the specified window
    int status = XChangeWindowAttributes(display, window_id, CWEventMask, &attributes);
    if (status == 0) {
        std::cerr << "Failed to change window attributes." << std::endl;
        XCloseDisplay(display);
        return 1;
    }

    // Cleanup and close the connection
    XCloseDisplay(display);
    std::cout << "Mouse events disabled for window ID: " << argv[1] << std::endl;

    return 0;
}
