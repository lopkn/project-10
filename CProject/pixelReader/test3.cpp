#include <iostream>
#include <SFML/Graphics.hpp>
#include <X11/Xlib.h>
#include <X11/Xutil.h>
#include <stdlib.h>

using namespace std;

// float * getPix(int x,int y, XImage *image){
//     static float out[3];
//     XColor c;
//     c.pixel = XGetPixel(image,0,0);
//     XQueryColor (d, XDefaultColormap(d, XDefaultScreen (d)), &c);
//     out[0] = c.red/256;
//     out[1] = c.green/256;
//     out[2] = c.blue/256;
//     return(out);
// }

XColor getPix(int x,int y, XImage *image){
    XColor c;
    c.pixel = XGetPixel(image,x,y);
    return(c);
}


int main(int, char**)
{

    int RESOL = 199;
    string s;
    cout << "resolution?\n";
    cin >> s;
    RESOL = stoi(s);

    XColor c;
    Display *d = XOpenDisplay((char *) NULL);

    int x=200;  // Pixel x 
    int y=200;  // Pixel y

    XImage *image;
    image = XGetImage (d, XRootWindow (d, XDefaultScreen (d)), x, y, 1, 1, AllPlanes, XYPixmap);
    c.pixel = XGetPixel (image, 0, 0);
    // XFree (image);
    XQueryColor (d, XDefaultColormap(d, XDefaultScreen (d)), &c);
    cout << c.red/256 << " " << c.green/256 << " " << c.blue/256 << "\n";



    sf::RenderWindow window(sf::VideoMode(RESOL, RESOL), "SFML works?");
    window.setFramerateLimit(60);
    sf::CircleShape shape(100.f);
    shape.setFillColor(sf::Color::Green);
    
    sf::Text text;
    sf::Font font;
    if(!font.loadFromFile("./arial/arial.ttf")){cout << "what?";}
    text.setFont(font);
    text.setString(to_string(c.red/256)+"-"+to_string(c.green/256)+"-"+to_string(c.blue/256));

    sf::Clock Clock;


    sf::RectangleShape r1;
    r1.setSize(sf::Vector2f(1,1));
    r1.setFillColor(sf::Color(200,0,150,200));
    r1.setPosition(2,2);

    sf::RectangleShape r3;
    r3.setSize(sf::Vector2f(1,1));
    r3.setFillColor(sf::Color(0,150,0,150));
    r3.setPosition(2,2);

    sf::RectangleShape r4;
    r4.setSize(sf::Vector2f(1,1));
    r4.setFillColor(sf::Color(0,0,150,100));
    r4.setPosition(2,2);

    sf::RectangleShape r2;
    r2.setSize(sf::Vector2f(RESOL+12,RESOL+12));
    r2.setFillColor(sf::Color(0,0,0,200));
    r2.setPosition(-1,-1);


text.setCharacterSize(24); // in pixels, not points!


text.setFillColor(sf::Color::Red);
    x = 0;
    y = 0;


    int overIntensity = 415;

    XColor MARR [RESOL*RESOL];
    int CMARR [RESOL*RESOL][3]; 
    XColor NMARR [RESOL*RESOL];

    XImage *image2;
    image2 = XGetImage (d, XRootWindow (d, XDefaultScreen (d)), x, y, 1, 1, AllPlanes, XYPixmap);

    Screen*  scrn = DefaultScreenOfDisplay(d);
    int height = scrn->height;
    int width  = scrn->width;


    int allpxMean = 0;
    int frameCounter = 0;


    while (window.isOpen())
    {
        sf::Event event;
        while (window.pollEvent(event))
        {
            if (event.type == sf::Event::Closed)
                window.close();
        }
        frameCounter ++;
    float time = Clock.getElapsedTime().asSeconds();
    
    // if(time < 0.5){
        // continue;}
    Clock.restart();
        // window.clear();
    window.draw(r2);

    int curPositionX = window.getPosition().x;
    int curPositionY = window.getPosition().y;

    XFree (image2);
    image2 = XGetImage (d, XRootWindow (d, XDefaultScreen (d)), curPositionX+RESOL+10, curPositionY+37, RESOL, RESOL, AllPlanes, XYPixmap);
    // XColor tcol = getPix(2,2,image2);
    // XQueryColor (d, XDefaultColormap(d, XDefaultScreen (d)), &tcol);
    // cout << to_string(tcol.red)+"-"+to_string(tcol.green)+"-"+to_string(tcol.blue)+"\n";


    for(y = 0; y < RESOL; y+=1){
        for(x = 0; x < RESOL; x+=1){
            int coor = x+y*RESOL;
            NMARR[coor] = getPix(x,y,image2);
        }
    }
    XQueryColors (d, XDefaultColormap(d, XDefaultScreen (d)), NMARR, RESOL*RESOL);


    int allpx = 0;

    for(y = 0; y < RESOL; y+=1){

        int lineLengNum[3] = {0,0,0};

        for(x = 0; x < RESOL-1; x+=1){
            int coor = x+y*RESOL;
            if(CMARR[coor][0] != abs(NMARR[coor].red/overIntensity)){            //RED
                CMARR[coor][0] = abs(NMARR[coor].red/overIntensity);

                lineLengNum[0]++;
                // continue;
                // r1.setPosition(x,y);
                // window.draw(r1);
            } else if(lineLengNum[0] != 0){
                r1.setSize(sf::Vector2f(lineLengNum[0],1));
                r1.setPosition(x-lineLengNum[0],y);
                allpx += lineLengNum[0];
                lineLengNum[0] = 0;
                window.draw(r1);
            }


            // if(CMARR[coor][2] != abs(NMARR[coor].blue/overIntensity/4)){            //BLUE
            //     CMARR[coor][2] = abs(NMARR[coor].blue/overIntensity/4);

            //     lineLengNum[2]++;
            //     // r1.setPosition(x,y);
            //     // window.draw(r1);
            // } else if(lineLengNum[2] != 0){
            //     r4.setSize(sf::Vector2f(lineLengNum[2],1));
            //     r4.setPosition(x-lineLengNum[2],y);
            //     allpx += lineLengNum[2];
            //     lineLengNum[2] = 0;
            //     window.draw(r4);
            // }

            // if(CMARR[coor][1] != abs(NMARR[coor].green/overIntensity/16)){            //GREEN
            //     CMARR[coor][1] = abs(NMARR[coor].green/overIntensity/16);

            //     lineLengNum[1]++;
            //     // continue;fundamental problem

            // } else if(lineLengNum[1] != 0){
            //     r3.setSize(sf::Vector2f(lineLengNum[1],1));
            //     r3.setPosition(x-lineLengNum[1],y);
            //     allpx += lineLengNum[1];
            //     lineLengNum[1] = 0;
            //     window.draw(r3);
            // }



        }
        x = RESOL-1;
        int coor = x+y*RESOL;

        if(CMARR[coor][0] != abs(NMARR[coor].red/overIntensity)){             //red
                CMARR[coor][0] = abs(NMARR[coor].red/overIntensity);
                lineLengNum[0]++;
            }
        if(lineLengNum[0] != 0){
                r1.setSize(sf::Vector2f(lineLengNum[0],1));
                r1.setPosition(x-lineLengNum[0],y);
                allpx += lineLengNum[0];
                window.draw(r1);
            }

    
        // if(CMARR[coor][2] != abs(NMARR[coor].blue/overIntensity/4)){             //blue
        //         CMARR[coor][2] = abs(NMARR[coor].blue/overIntensity/4);
        //         lineLengNum[2]++;
        //     }
        // if(lineLengNum[2] != 0){
        //         r4.setSize(sf::Vector2f(lineLengNum[2],1));
        //         r4.setPosition(x-lineLengNum[2],y);
        //         allpx += lineLengNum[2];
        //         window.draw(r4);
        //     }

        //     if(CMARR[coor][1] != abs(NMARR[coor].green/overIntensity/16)){             //green
        //         CMARR[coor][1] = abs(NMARR[coor].green/overIntensity/16);
        //         lineLengNum[1]++;
        //     }
        // if(lineLengNum[1] != 0){
        //         r3.setSize(sf::Vector2f(lineLengNum[1],1));
        //         r3.setPosition(x-lineLengNum[1],y);
        //         allpx += lineLengNum[1];
        //         window.draw(r3);
        //     }
    }




    if(frameCounter%10 != 1){
        allpxMean += allpx;
    }

    if(frameCounter % 10 == 0){
        if(allpxMean/9 > RESOL*RESOL*0.2){
            // overIntensity+=RESOL*RESOL*100/abs(allpxMean/9);
            // overIntensity *= RESOL*RESOL*2/abs(allpxMean/9);
            overIntensity = overIntensity* 1.1 + RESOL*RESOL*100/abs(allpxMean/9);
        } else if(overIntensity > 415){
            overIntensity *= 0.9;

            for(int D = 0; D < RESOL*RESOL; D++){
                CMARR[D][0] = NMARR[D].red/overIntensity;
                CMARR[D][1] = NMARR[D].green/overIntensity/16;
                CMARR[D][2] = NMARR[D].blue/overIntensity/4;
            }

        }
        allpxMean = 0;
    }



    // for(y = 0; y < 199; y+=1){
    //     for(x = 0; x < 199; x+=1){
    //         XColor col = getPix(x,y,image2);
    //         XQueryColor (d, XDefaultColormap(d, XDefaultScreen (d)), &col);

    //         int coor = x+y*199;
    //         if(MARR[coor] != col.red){
    //             MARR[coor] = col.red;
    //             r1.setPosition(x,y);
    //             window.draw(r1);
    //         }

    //     }
    // }



    // cout << (to_string(col.red/256)+"-"+to_string(col.green/256)+"-"+to_string(col.blue/256));

    text.setString(to_string(time) + "-overintensity:" + to_string(overIntensity));
    // text.setString(to_string(col[0])+"-"+to_string(col[1])+"-"+to_string(col[2]));
    // cout << to_string(col[0])+"-"+to_string(col[1])+"-"+to_string(col[2]);
    // cout << "\n";

        // window.draw(shape);
        window.draw(text);
        window.draw(r1);
        if(frameCounter%10 != 1){
        window.display();}
    }

    return 0;
}


//g++ -c test3.cpp -lX11&&g++ test3.o -o sfml-app -lsfml-graphics -lsfml-window -lsfml-system -lX11

