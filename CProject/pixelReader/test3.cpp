#include <iostream>
#include <SFML/Graphics.hpp>
#include <X11/Xlib.h>
#include <X11/Xutil.h>

using namespace std;

int main(int, char**)
{
    XColor c;
    Display *d = XOpenDisplay((char *) NULL);

    int x=0;  // Pixel x 
    int y=0;  // Pixel y

    XImage *image;
    image = XGetImage (d, XRootWindow (d, XDefaultScreen (d)), x, y, 1, 1, AllPlanes, XYPixmap);
    c.pixel = XGetPixel (image, 0, 0);
    XFree (image);
    XQueryColor (d, XDefaultColormap(d, XDefaultScreen (d)), &c);
    cout << c.red/256 << " " << c.green/256 << " " << c.blue/256 << "\n";

    sf::RenderWindow window(sf::VideoMode(200, 200), "SFML works?");
    sf::CircleShape shape(100.f);
    shape.setFillColor(sf::Color::Green);
    
    sf::Text text;
    sf::Font font;
    if(!font.loadFromFile("./arial/arial.ttf")){cout << "what?";}
    text.setFont(font);
    text.setString(to_string(c.red/256)+"-"+to_string(c.green/256)+"-"+to_string(c.blue/256));

    sf::Clock Clock;

text.setCharacterSize(24); // in pixels, not points!


text.setFillColor(sf::Color::Red);

    while (window.isOpen())
    {
        sf::Event event;
        while (window.pollEvent(event))
        {
            if (event.type == sf::Event::Closed)
                window.close();
        }
	float time = Clock.getElapsedTime().asSeconds();
	
	//if(time < 0.2){continue;}
	//Clock.restart();
	
	text.setString(to_string(time));

        window.clear();
        window.draw(shape);
        window.draw(text);
        window.display();
    }

    return 0;
}


//g++ -c test3.cpp -lX11&&g++ test3.o -o sfml-app -lsfml-graphics -lsfml-window -lsfml-system -lX11

