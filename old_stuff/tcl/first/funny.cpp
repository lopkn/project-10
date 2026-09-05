#include <stdio.h>
#include <unistd.h>

#include <X11/X.h>
#include <X11/Xlib.h>

int main()
{
  Display* disp     = XOpenDisplay(NULL);
  Window   root     = XDefaultRootWindow(disp);
  int      scr      = XDefaultScreen(disp);
  GC       context  = XDefaultGC(disp, scr);
  ulong fg          = BlackPixel(disp, scr);  // fg color
  ulong bg          = WhitePixel(disp, scr);  // bg color
  int depth         = 1;
  Window win        = XCreateSimpleWindow(disp, root, 0, 0, 50, 50, depth, fg, bg);

  long events = 
    ExposureMask |
    ButtonPressMask | 
    ButtonReleaseMask | 
    PointerMotionMask;

  XSelectInput(disp, win, events);
  XMapWindow(disp, win);
  XFlush(disp);

  unsigned int masks = PointerMotionMask | ButtonPressMask | ButtonReleaseMask;
  XGrabPointer(
    disp, win, true, masks, GrabModeSync, GrabModeAsync, None, None, CurrentTime
  );
  XEvent event;

  do { 
    XNextEvent(disp, &event);
    switch (event.type) {
      case ButtonPress    :
        printf("pressed  %i\n", event.xbutton.button);
        break;
      case ButtonRelease  :
        printf("released %i\n", event.xbutton.button);
        break;
      case MotionNotify   :
        printf("move x %i y %i\n", event.xmotion.x, event.xmotion.y);
        break;
      default : break;
    }
    usleep(1000);    

  } while (true);

  XCloseDisplay(disp);
  return 0;
}

