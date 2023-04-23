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
	std::string s2 = "sudo -u '#" + s1 +"' XDG_RUNTIME_DIR=/run/user/"+s1+" aplay "+wavFile+" >>/dev/null 2>>/dev/null &";
	int i3 = std::system(s2.c_str());
}

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
		printf("returning to mouse speed -0.75\n");
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
}

int main()
{
		remove("text.txt");
		system("xinput --list-props \"PixArt Microsoft USB Optical Mouse\" >> text.txt");
		system("xinput --set-prop \"PixArt Microsoft USB Optical Mouse\" \"libinput Accel Speed\" -0.75");
		std::cout << "properties file updated.\nmouse speed set to -0.75 (default value 22apr23)" << std::endl;
		std::cout << "Parent Process id : " << getpid() << std::endl;
		std::string s1 = std::getenv("SUDO_UID");
		std::cout << s1 << " is the current user ID \n\n";

		int G = system("sudo -u '#1002' XDG_RUNTIME_DIR=/run/user/1002 aplay start.wav >>/dev/null 2>>/dev/null &");
        char devname[] = "/dev/input/event2";
        int device = open(devname, O_RDONLY);
        struct input_event ev;

        signal(SIGINT, INThandler);

        while(1)
        {
                read(device,&ev, sizeof(ev));
                if(ev.type == 1 && ev.value == 1){
                        // system(std::string("sudo -u '#" + s1 +"' XDG_RUNTIME_DIR=/run/user/"+s1+" aplay ding2.wav &").c_str());
                        // myPlay("ding2.wav",s1);
                        myDo(ev.code,s1);
                        printf("Key: %i State: %i\n",ev.code,ev.value);
                        // std::cout<<std::endl;
                }
        }
        return 0;
}