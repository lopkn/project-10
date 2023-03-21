#include <iostream>
using namespace std;
#include <fstream>
#include <X11/Xlib.h>
#include <X11/Xutil.h>
#include <X11/Xresource.h>

Display *d = XOpenDisplay((char *) NULL);
XImage *image;
void something(Display *d, int x, int y)
{
    image = XGetImage (d, RootWindow (d, DefaultScreen (d)), x, y, 1, 1, AllPlanes, XYPixmap);
}

void GetPix(Display *d, int x, int y, XColor *color)
{
  color->pixel = XGetPixel(image, x, y);
  XQueryColor (d, DefaultColormap(d, DefaultScreen (d)), color);
}

int main()
{
    something(d, 0, 0);
    XColor dre;
   // ofstream file;
 //   file.open("log.txt");

     int x=2;
     int y=2;
 	for(int i = 0; i < 20; i++){
 		XColor c;
            GetPix(d, x, y+i, &c );
            cout << c.red/256 << "  " << c.green/256 << "  " << c.blue/256;
            cout << endl;
      }

    XFree (image);
    cout << "Done";
    return 0;

}
