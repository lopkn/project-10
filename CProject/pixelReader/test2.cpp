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
    XColor c;
    ofstream file;
    file.open("log.txt");
   // register int x;
   // register int y;
    for (int x = 0; x < 1024; x++ )
    {

        for (int y = 0; y < 768; y++)
        {
            GetPix(d, x, y, &c );
            file << c.red << "  " << c.green << "  " << c.blue;
            file << endl;

        }

    }
    XFree (image);
    cout << "Done";
    return 0;

}
