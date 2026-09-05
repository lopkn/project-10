#include <X11/Xlib.h>
#include <X11/Xutil.h>
#include <cstdlib>
#include <cstdio>

int main(int argc, char** argv) {
    if (argc != 2) {
        fprintf(stderr, "Usage: %s <window-id>\n", argv[0]);
        fprintf(stderr, "Example: %s 0x3a00007\n", argv[0]);
        return 1;
    }

    // Parse window ID (hex or decimal)
    Window target = (Window)strtoul(argv[1], nullptr, 0);

    Display* dpy = XOpenDisplay(nullptr);
    if (!dpy) {
        fprintf(stderr, "Failed to open X display\n");
        return 1;
    }

    // Build a synthetic ButtonPress event
    XEvent ev;
    ev.xbutton.type = ButtonPress;
    ev.xbutton.display = dpy;
    ev.xbutton.window = target;
    ev.xbutton.root = DefaultRootWindow(dpy);
    ev.xbutton.subwindow = None;
    ev.xbutton.time = CurrentTime;
    ev.xbutton.x = 1;
    ev.xbutton.y = 1;
    ev.xbutton.x_root = 1;
    ev.xbutton.y_root = 1;
    ev.xbutton.state = 0;
    ev.xbutton.button = Button1;
    ev.xbutton.same_screen = True;

    // Send directly to the target window (no implicit grab)
    Status result = XSendEvent(
        dpy,
        target,
        True,
        ButtonPressMask,
        &ev
    );

    XFlush(dpy);
    XCloseDisplay(dpy);

    if (result == 0) {
        fprintf(stderr, "XSendEvent failed (window may ignore synthetic events)\n");
        return 1;
    }

    return 0;
}

