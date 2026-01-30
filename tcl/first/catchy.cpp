#include <X11/Xlib.h>
#include <iostream>
int main(int argc, char** argv) {
    if (argc != 2) {
        fprintf(stderr, "Usage: %s <window-id>\n", argv[0]);
        fprintf(stderr, "Example: %s 0x3a00007\n", argv[0]);
        return 1;
    }

    // Parse window ID (hex or decimal)
    Window target = static_cast<Window>(std::strtoull(argv[1], nullptr, 0));
    
    
    Display *display;

    // Open the display
    display = XOpenDisplay(NULL);
    if (display == NULL) {
        std::cerr << "Cannot open display\n";
        return 1;
    }

    // Change the event mask to 0 (no events)
    XSelectInput(display, target, 0);
    std::cout << "set event mask" << std::endl;
    XFlush(display);
   
    // Close the display
    XCloseDisplay(display);
    return 0;
}
