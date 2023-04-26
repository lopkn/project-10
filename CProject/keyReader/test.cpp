// #include <stdlib.h>
#include <iostream>
#include <chrono> 
#include <thread>

// void mySleep(int x){
// 	std::this_thread::sleep_for(std::chrono::milliseconds(x));
// }


// int main(){
// 	system("aplay ding2.wav &");
// 	system("aplay ding2.wav &");
// 	system("aplay ding2.wav &");


// 	mySleep(500);
// 	system("aplay ding3.wav");
// 	std::cout << "done \n\n";
// 	return 0;
// }

#include <stdio.h>
#include <fcntl.h>
#include <linux/input.h>
// #include <sys/types.h>
#include <unistd.h>
#include <signal.h>
#include <stdlib.h>


#include <iostream>
#include <SFML/Graphics.hpp>
#include <X11/Xlib.h>
#include <X11/Xutil.h>
#include <X11/Xatom.h>
#include <cstring>


int inputMode = 0;
int lastKey = 400;
int keyRepeats = 0;

bool extraSlow = false;

//input Reference
//0 = none
//1 = +

void INThandler(int x){
        exit(0);
}

// ~/.config/autokey/data/actual scripts/NOTE2.mp3 may be useful, nvm its wav

void myPlay(std::string wavFile, std::string s1){
	std::string s2 = "dummy=$(sudo -u '#" + s1 +"' XDG_RUNTIME_DIR=/run/user/"+s1+" aplay "+wavFile+" 2>/dev/null) &";

	int i3 = std::system(s2.c_str());
}

Display *d;
Display *dpy; 
Window root_window;





void myMouseMove(int x, int y){
	// XColor c;
    // XImage *image;
    // image = XGetImage (d, XRootWindow (d, XDefaultScreen (d)), 200, 200, 1, 1, AllPlanes, XYPixmap);
    // c.pixel = XGetPixel (image, 0, 0);
    // XFree (image);
    // XQueryColor (d, XDefaultColormap(d, XDefaultScreen (d)), &c);
    // cout << c.red/256 << " " << c.green/256 << " " << c.blue/256 << "\n";

    // XWarpPointer(dpy,None,root_window,0,0,0,0,x,y);
    // XSync(dpy, false);
    // Display *dpyy = dpy;
    XWarpPointer(dpy,None,root_window,0,0,0,0,x,y);
    XSync(dpy, false);
    XFlush(dpy);
}

int * myGetMousePos(){
	int rootX,rootY,winX,winY;
		Window root, child;
		unsigned int mask;
		XQueryPointer(dpy,DefaultRootWindow(dpy),&root,&child,
                        &rootX,&rootY,&winX,&winY,&mask);
	static int pos[2];
	pos[0] = rootX;
	pos[1] = rootY;
	return(pos);
}

XColor getPix(int x,int y, XImage *image){
    XColor c;
    c.pixel = XGetPixel(image,x,y);
    return(c);
}//pasted

const int scanEach = 40;
const int scanRes = scanEach*scanEach;
const int scanEachH = scanEach/2;
int ocor[scanRes];

void myXset();

int * myCorrecter(int narr[scanRes]){

	
	int adx = 0;
	int ady = 0;

	float currentMinima;
	for(int z = 0; z < scanRes; z++){
		currentMinima += abs(ocor[z]-narr[z]);
	}
	currentMinima = currentMinima/scanRes-1;

	std::cout << int(currentMinima) << std::endl;

	for(int dy = -scanEach+1; dy < scanEach; dy++){
	for(int dx = -scanEach+1; dx < scanEach; dx++){
		float ttdx = 0;
		int processed = 0;
		int position = -1;
		for(int y = dx; y < dx+scanEach; y++){
			for(int x = dy; x < dy+scanEach; x++){
				position++;
				int index = x+y*scanEach;
				if(x < 0 || x >= scanEach || y < 0 || y >= scanEach){
					continue;
				}
				processed++;
				int tdx = abs(ocor[index]-narr[position]);
				ttdx += tdx;
			}
		}
		ttdx = ttdx/processed;
		if(ttdx < currentMinima){
			currentMinima = ttdx;
			adx = dx;
			ady = dy;
		}
		std::string cr;
		if(int(ttdx/2) < 10 && int(ttdx/2) >= 0){
			cr = std::to_string(int(ttdx/2));
		} else if(ttdx < 0){
			cr = "#";
		} else {
			cr = "@";
		}
		// std::cout<<cr;
		}
		// std::cout<<std::endl;
	}
	std::cout << "done: " << adx << " - " << ady << " <- " << currentMinima <<std::endl;
	// memcpy(ocor,narr,sizeof(ocor));
	static int pos[2];
	pos[0] = adx;
	pos[1] = ady;
	return(pos);
}

void myXset(){
	int * pos = myGetMousePos();
	    XColor NMARR [scanRes];
    XImage *image;
    image = XGetImage (dpy, XRootWindow (dpy, XDefaultScreen (dpy)), pos[0]-scanEachH,pos[1]-scanEachH, scanEach, scanEach, AllPlanes, XYPixmap);
    for(int y = 0; y < scanEach; y+=1){
        for(int x = 0; x < scanEach; x+=1){
            int coor = x+y*scanEach;
            NMARR[coor] = getPix(x,y,image);
        }
    }

    XFree (image);
    XQueryColors (dpy, XDefaultColormap(dpy, XDefaultScreen (dpy)), NMARR, scanRes);
    for(int z = 0; z < scanRes; z++){
    	ocor[z] = NMARR[z].red/256;
    }
}

int * myXaim(){
	int * pos = myGetMousePos();
	int dx = 0;
	int dy = 0;
	int x = 0;
	int y = 0;
    XColor NMARR [scanRes];
	XColor c;
    XImage *image;
    image = XGetImage (dpy, XRootWindow (dpy, XDefaultScreen (dpy)), pos[0]-scanEachH,pos[1]-scanEachH, scanEach, scanEach, AllPlanes, XYPixmap);

    for(y = 0; y < scanEach; y+=1){
        for(x = 0; x < scanEach; x+=1){
            int coor = x+y*scanEach;
            NMARR[coor] = getPix(x,y,image);
        }
    }

    XFree (image);


    XQueryColors (dpy, XDefaultColormap(dpy, XDefaultScreen (dpy)), NMARR, scanRes);
    std::cout << NMARR[0].red/256 << "\n";
    int ncor[scanRes];
    for(int z = 0; z < scanRes; z++){
    	ncor[z] = NMARR[z].red/256;
    }

    int * poss = myCorrecter(ncor);
    dx = poss[0];
    dy = poss[1];


    static int moveRel[2];
    moveRel[0] = dx;
    moveRel[1] = dy;
	myMouseMove(pos[0]-dx, pos[1]-dy);
	myXset();
	return(moveRel);
}





int keysounds = 0;
//0: none, 1: apx

void myDo(int x,std::string s1){

	if(lastKey == x){
		keyRepeats += 1;
	} else {
		keyRepeats = 1;
		lastKey = x;
	}
	if(x == 78){
		if(inputMode != 1){
		myPlay("ding2.wav",s1);
			inputMode = 1;
		} else {
			inputMode = 0;
			myPlay("close.wav",s1);
		}
	} else if(x == 98){ 
		std::cout << "returning to mouse speed -0.75\n";
		system("xinput --set-prop \"PixArt Microsoft USB Optical Mouse\" \"libinput Accel Speed\" -0.75");
		system("xinput --set-prop \"PixArt Microsoft USB Optical Mouse\" \"Coordinate Transformation Matrix\" 1 0 0 0 1 0 0 0 1");
		myPlay("allClose.wav",s1);
		exit(0);
	} else if(x == 74){
		if(extraSlow == false){
			extraSlow = true;
			myPlay("bitExtLow.wav",s1);
			system("xinput --set-prop \"PixArt Microsoft USB Optical Mouse\" \"Coordinate Transformation Matrix\" 0.1 0 0 0 0.1 0 0 0 1");
		} else {
			extraSlow = false;
			system("xinput --set-prop \"PixArt Microsoft USB Optical Mouse\" \"Coordinate Transformation Matrix\" 1 0 0 0 1 0 0 0 1");
		}
	} else if(x == 71 && inputMode == 1){
		myPlay("bitLow.wav",s1);
		system("xinput --set-prop \"PixArt Microsoft USB Optical Mouse\" \"libinput Accel Speed\" -1");
	} else if(x == 72 && inputMode == 1){
		system("xinput --set-prop \"PixArt Microsoft USB Optical Mouse\" \"libinput Accel Speed\" -0.75");
		myPlay("bitMid.wav",s1);
	} else if(x == 73 && inputMode == 1){
		system("xinput --set-prop \"PixArt Microsoft USB Optical Mouse\" \"libinput Accel Speed\" -0.3");
		myPlay("bitHigh.wav",s1);
	} else if(x == 77 && inputMode == 1){
		system("xinput --set-prop \"PixArt Microsoft USB Optical Mouse\" \"libinput Accel Speed\" 1");
		myPlay("bitHigh.wav",s1);
	} else if(x == 55){
		system("xinput --set-prop \"PixArt Microsoft USB Optical Mouse\" \"libinput Accel Speed\" -0.75");
		system("xinput --set-prop \"PixArt Microsoft USB Optical Mouse\" \"Coordinate Transformation Matrix\" 1 0 0 0 1 0 0 0 1");
		extraSlow = false;
		myPlay("allClose.wav",s1);
	} else if(x == 50){
		myPlay("map.wav",s1);
	}

	else if(x == 43 && keyRepeats%3 == 0){
		keysounds++;
		if(keysounds == 1){
			myPlay("Asounds.wav",s1);
		} else if(keysounds == 2){
			keysounds = 0;
		}
	}


	if(keysounds == 1){
		if(x == 19){
			myPlay("Reload.wav",s1);

		}else if(x == 16 ){
			myPlay("Qskill.wav",s1);
		}else if(x == 44 ){
			myPlay("Uskill.wav",s1);
		}else if(x == 18){
			myPlay("Interact.wav",s1);
		}else if(x == 33){
			myPlay("Fenemy.wav",s1);
		}else if(x == 34){
			myPlay("Grenade.wav",s1);
		}else if(x == 45){
			int * pos = myGetMousePos();
			std::cout<<"xMousepos: "<<pos[0] << "-"<<pos[1]<<std::endl;
			myXaim();
			// myMouseMove(pos[0], pos[1]+10);
		} else if(x == 46){
			myXset();
		}
	}
}




int main()
{

	d = XOpenDisplay((char *) NULL);
	dpy = XOpenDisplay(0);
	root_window = XRootWindow(dpy, 0);

	for(int z = 0; z < scanRes; z++){
	ocor[z] = 0;
	}
	//xlib stuff

		remove("text.txt");
		system("xinput --list-props \"PixArt Microsoft USB Optical Mouse\" >> text.txt");
		system("xinput --set-prop \"PixArt Microsoft USB Optical Mouse\" \"libinput Accel Speed\" -0.75");
		std::cout << "properties file updated.\nmouse speed set to -0.75 (default value 22apr23)" << std::endl;
		std::cout << "Parent Process id : " << getpid() << std::endl;
		std::string s1 = std::getenv("SUDO_UID");
		std::cout << s1 << " is the current user ID \n\n";

		// int G = system("sudo -u '#1002' XDG_RUNTIME_DIR=/run/user/1002 aplay start.wav >>/dev/null 2>>/dev/null &");
        char devname[] = "/dev/input/event2";
        int device = open(devname, O_RDONLY);
        struct input_event ev;

        signal(SIGINT, INThandler);

        while(1)
        {
                read(device,&ev, sizeof(ev));
                if(ev.type == 1 && ev.value == 1){

                        myDo(ev.code,s1);
                        std::cout << "Key: " << ev.code << " State: " << ev.value << std::endl;
                }
        }
        return 0;
}



//Eye tracker aim bot
//suvat equa

//g++ -c test.cpp -lX11&&g++ test.o -o sfml-app -lsfml-graphics -lsfml-window -lsfml-system -lX11 && sudo ./sfml-app