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
			std::cout<<pos[0] << "-"<<pos[1]<<std::endl;
			myMouseMove(pos[0], pos[1]+10);
		}
	}
}




int main()
{

	d = XOpenDisplay((char *) NULL);
	dpy = XOpenDisplay(0);
	root_window = XRootWindow(dpy, 0);


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