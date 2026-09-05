#include <stdio.h>
#include <stdlib.h>
#include <X11/Xlib.h>
#include <X11/Xutil.h>
#include <X11/keysym.h>

int main(int argc, char **argv)
{
    Display *dpy;
    Window root;

    if((dpy = XOpenDisplay(NULL)) == NULL) {
        perror(argv[0]);
        exit(1);
    }

    root = XDefaultRootWindow(dpy);

    XGrabPointer(dpy, root, False, ButtonReleaseMask, GrabModeAsync, 
             GrabModeAsync, None, None, CurrentTime);

    int state;
    XWindowAttributes attributes;

    XGetInputFocus(dpy,&root,&state);
    printf("window id = %d\n"); 

    unsigned long event_mask = KeyReleaseMask | ButtonReleaseMask;
    XSelectInput(dpy,root,event_mask);

    XEvent ev;

    while(1) {
        XNextEvent(dpy, &ev);
        printf("Type: %d\n", ev.type);
        if(ev.type == ButtonRelease){
            printf("button release\n");
        }

        if (ev.type == KeyPress) {
            printf("keypress event\n");
            if (XLookupKeysym(&ev.xkey, 0) == XK_q) {
                exit(0);
            }
        }
    }

    return 0;
}
