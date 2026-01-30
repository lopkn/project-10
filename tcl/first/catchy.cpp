#include <X11/Xlib.h>
#include <iostream>

int main() {
    Display *display;
    Window target_window; // Assign the target window ID

    // Open the display
    display = XOpenDisplay(NULL);
    if (display == NULL) {
        std::cerr << "Cannot open display\n";
        return 1;
    }

    // Change the event mask to 0 (no events)
    XSelectInput(display, target_window, 0);
    std:cout << "set event mask" << std::endl
    // Close the display
    XCloseDisplay(display);
    return 0;
}
