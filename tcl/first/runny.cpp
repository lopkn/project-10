#include <X11/Xlib.h>
#include <X11/extensions/XTest.h>
#include <cstdlib>
#include <cstdio>

int main(int argc, char** argv) {
    if (argc != 2) {
        fprintf(stderr, "Usage: %s <window-id>\n", argv[0]);
        return 1;
    }

    // Parse window ID (hex or decimal)
    Window target = (Window)strtoul(argv[1], nullptr, 0);

    Display* dpy = XOpenDisplay(nullptr);
    if (!dpy) {
        fprintf(stderr, "Failed to open X display\n");
        return 1;
    }

    // Move pointer into the target window so the press is attributed to it
    XWindowAttributes attr;
    if (!XGetWindowAttributes(dpy, target, &attr)) {
        fprintf(stderr, "Invalid window ID\n");
        return 1;
    }

    int x = attr.x + 1;
    int y = attr.y + 1;

    XWarpPointer(
        dpy,
        None,
        target,
        0, 0, 0, 0,
        x, y
    );

    XFlush(dpy);

    // REAL (non-synthetic) button press
    XTestFakeButtonEvent(
        dpy,
        Button1,
        True,   // press
        CurrentTime
    );

    XFlush(dpy);
    XCloseDisplay(dpy);
    return 0;
}

