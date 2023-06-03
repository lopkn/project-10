// #include <stdlib.h>
#include <iostream>
#include <chrono> 
#include <thread>


#include <stdio.h>
#include <fcntl.h>
#include <linux/input.h>
// #include <sys/types.h>
#include <unistd.h>
#include <signal.h>
#include <stdlib.h>

#include <poll.h>

#include <map>
#include <iostream>
#include <SFML/Graphics.hpp>
#include <X11/Xlib.h>
#include <X11/Xutil.h>
#include <X11/Xatom.h>
#include <cstring>
std::string s1;
std::map<int, char> keyMap = {
    { 16, 'q' },{ 17, 'w' },{ 57, ' ' },
    { 18, 'e' },{ 19, 'r' },{ 20, 't' },{ 21, 'y' },{ 22, 'u' },{ 23, 'i' },{ 24, 'o' },{ 25, 'p' },
    { 30, 'a' },{ 31, 's' },{ 32, 'd' },{ 33, 'f' },{ 34, 'g' },{ 35, 'h' },{ 36, 'j' },{ 37, 'k' },{ 38, 'l' },
    { 44, 'z' },{ 45, 'x' },{ 46, 'c' },{ 47, 'v' },{ 48, 'b' },{ 49, 'n' },{ 50, 'm' },{ 26, '[' },{ 27, ']' },
    { 43, 'S'},{ 2, '1'},{ 3, '2'},{ 4, '3'},{ 5, '4'},{ 6, '5'},{ 7, '6'},{ 8, '7'},{ 9, '8'},{ 10, '9'},{ 11, '0'}


};
//79 80 81
//75 76 77
//71 72 73

void scanr();
void recoilReader(int xarr[100][3], int size);

struct AST{
	bool firedown = false;
	bool aimprint = true;
	bool stopsound = false;
	int downMode = 1;
	int weaponSetter = 3;
	int weaponSet[3] = {1,2,3};
	int prowlerAST[100][3] = {{50,0,7},{50,0,7},{50,0,7},{50,0,7}};
	int nemesisAST[100][3] = {{50,0,5},{50,0,5},{50,0,6}};
	// int carAST[100][3] = {{64,1,8},{64,1,7},{64,1,7},{64,1,7},{64,2,7},{64,2,7},{64,2,7},{64,2,7},{64,1,1},{64,0,1},{64,0,1},{64,-2,1},{64,-2,3},{64,-2,3},{64,0,3},{64,0,1},{64,0,1},{64,0,1},{64,0,1},{64,0,1}};
	int carAST[100][3] = {{64,1,6},{64,2,7},{64,3,7},{64,3,8},{64,1,7},{64,0,7},{64,0,7},{65,0,7},{64,-1,6},{65,-1,5},{65,-1,3},{65,-1,3},{65,-1,3}};
	int r99AST[100][3] = {{64,0,6},{64,-1,7},{64,-2,7},{64,-2,8},{64,-2,7},{64,-1,7},{64,0,7},{65,0,7},{64,0,6},{65,0,5},{65,0,3},{65,0,3},{65,0,3}};
	int flatlineAST[100][3] = {{50,1,9},{100,2,5},{100,3,5},{100,1,6},{100,2,5},{100,-1,4},{100,-1,1},{100,-2,0},{100,-3,0},{100,-3,0},{100,0,4},{100,0,5},{100,4,2},{100,3,0},{100,5,0},{100,5,0},{100,5,3},{100,4,4},{100,5,5},{100,1,4}};
	int rampageAST[100][3] = {{50,-1,6},{200,4,4},{200,2,5},{200,-3,4},{200,-1,7},{200,-3,5},{200,-3,4},{200,-3,3},{200,-3,3},{200,0,3},{200,3,4},{200,3,4},{200,3,4}};
	int spitfireAST[100][3] = {{20,2,14},{140,0,4},{140,7,7},{140,0,7},{140,0,11},{140,2,4},{140,-2,0},{140,-2,1},{140,-2,0},{140,-2,2},{140,1,2},{140,3,3},{140,3,3},{140,3,2}};
	int lstarAST[100][3] = {{50,5,8},{100,4,8},{100,4,8},{100,3,8},{100,-3,8},{100,-4,6},{100,-3,6},{100,-3,7},{100,-3,7},{100,3,6},{100,3,8},{100,3,8},{100,3,8},{100,0,8},{100,0,8},{100,0,8},{100,0,8},{100,0,8}};
	int re45AST[100][3] = {{39,0,4},{78,0,4},{78,-2,4},{78,-3,4},{78,-3,4},{78,-3,4} ,{78,-3,3},{78,-3,3},{78,-3,3},{78,-3,3},{78,-3,4},{78,-3,3},{78,-3,3},{78,-3,4},{78,-3,3},{78,-3,3},{78,-3,3},{78,-3,3},{78,-3,3}};

	const static int weaponCount = 9;
	int (*ASTs[weaponCount])[100][3] = {&re45AST,&prowlerAST,&nemesisAST,&carAST,&r99AST,&flatlineAST,&rampageAST,&spitfireAST,&lstarAST};
	std::string ASTsounds[weaponCount] = {"","AUDprowler.wav","AUDnemesis.wav","AUDcar.wav","AUDr99.wav","AUDflatline.wav","AUDrampage.wav","AUDspitfire.wav","AUDlstar.wav"};
	//prowler, nemesisx
};
AST mast;

int inputMode = 0;
int lastKey = 400;
int keyRepeats = 0;


int keyboardEventX = 2;
int mouseEventX = 3;

bool extraSlow = false;

//input Reference
//0 = none
//1 = +

void INThandler(int x){
        exit(0);
}

uint64_t timeNow(){
	using namespace std::chrono;
    uint64_t ms = duration_cast<milliseconds>(system_clock::now().time_since_epoch()).count();
    return(ms);
}

void usleep(int x){
	std::this_thread::sleep_for(std::chrono::milliseconds(x));
}


// ~/.config/autokey/data/actual scripts/NOTE2.mp3 may be useful, nvm its wav

void myPlay(std::string wavFile, std::string s1){
	if(mast.stopsound){
		return;
	}
	std::string s2 = "dummy=$(sudo -u '#" + s1 +"' XDG_RUNTIME_DIR=/run/user/"+s1+" aplay "+wavFile+" 2>/dev/null) &";

	int i3 = std::system(s2.c_str());
}

Display *d;
Display *dpy; 
int dfs;
Window root_window;
Window w;

std::string myHeatDict(int val){
	if(val < 0){
		return(" ");
	} else if(val < 26){
		return("1");
	} else if(val < 52){
		return("2");
	} else if(val < 77){
		return("3");
	} else if(val < 103){
		return("4");
	} else if(val < 128){
		return("5");
	} else if(val < 154){
		return("6");
	} else if(val < 180){
		return("7");
	} else if(val < 205){
		return("8");
	} else if(val < 231){
		return("9");
	} else if(val < 256){
		return(".");
	} else {
		return("#");
	}
}
std::string myHeatDict2(int val){
	if(val < 0){
		return(" ");
	} else if(val < 26){
		return(".");
	} else if(val < 52){
		return(":");
	} else if(val < 77){
		return("-");
	} else if(val < 103){
		return("=");
	} else if(val < 128){
		return("+");
	} else if(val < 154){
		return("n");
	} else if(val < 180){
		return("m");
	} else if(val < 205){
		return("M");
	} else if(val < 231){
		return("%");
	} else if(val < 256){
		return("#");
	} else {
		return("@");
	}
}


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

const int scanEach = 50;
const int scanRes = scanEach*scanEach;
const int scanEachH = scanEach/2;
int ocor[scanRes];

bool mapLocked = true;

bool heatMapToggle = false;

void myHeatMap(int narr[scanRes]){
	std::cout << "\n====HEATMAP====\n";
	for(int j = 0; j < scanEach; j++){
		std::cout<<"\n";
		for(int i = 0; i < scanEach; i++){
			std::cout << myHeatDict2(narr[i+j*scanEach]);
		}
	}
	std::cout << "\n====HEATMAP====\n";
}


void myXset();
XColor * myXscan(int xstart, int ystart, int xwid = 20, int ywid = 20, int xskip = 1, int yskip = 1){
	const int res = xwid*ywid;
	XColor scanArr[res];
	static XColor *scanArrP = scanArr;
	XImage *image;
    image = XGetImage (dpy, XRootWindow (dpy, dfs), xstart,ystart, xwid*xskip, ywid*yskip, AllPlanes, XYPixmap);

	for(int i = 0; i < xwid; i++){
		for(int j = 0; j < ywid; j++){
			scanArr[i+j*xwid] = getPix(i*xskip,j*yskip,image);
		}
	}
    XFree(image);

    XQueryColors (dpy, XDefaultColormap(dpy, dfs), scanArr, xwid*ywid);
    return(scanArrP);
}

int * myCorrecter(int narr[scanRes]){

	if(heatMapToggle){
		myHeatMap(narr);
	}
	
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
		
		// std::cout<<cr;

		}
		// std::cout<<std::endl;
	}
	std::cout << "done: " << adx << " - " << ady << " <- " << currentMinima << std::endl;
	static int pos[2];
	pos[0] = adx;
	pos[1] = ady;
	return(pos);
}

void myXset(){
	int * pos = myGetMousePos();
	    XColor NMARR [scanRes];
    XImage *image;
    image = XGetImage (dpy, XRootWindow (dpy, dfs), pos[0]-scanEachH,pos[1]-scanEachH, scanEach, scanEach, AllPlanes, XYPixmap);
    for(int y = 0; y < scanEach; y+=1){
        for(int x = 0; x < scanEach; x+=1){
            int coor = x+y*scanEach;
            NMARR[coor] = getPix(x,y,image);
        }
    }

    XFree (image);
    XQueryColors (dpy, XDefaultColormap(dpy, dfs), NMARR, scanRes);
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
    image = XGetImage (dpy, XRootWindow (dpy, dfs), pos[0]-scanEachH,pos[1]-scanEachH, scanEach, scanEach, AllPlanes, XYPixmap);

    for(y = 0; y < scanEach; y+=1){
        for(x = 0; x < scanEach; x+=1){
            int coor = x+y*scanEach;
            NMARR[coor] = getPix(x,y,image);
        }
    }

    XFree (image);


    XQueryColors (dpy, XDefaultColormap(dpy, dfs), NMARR, scanRes);
    std::cout << NMARR[0].blue/256 << "\n";
    int ncor[scanRes];
    for(int z = 0; z < scanRes; z++){
    	ncor[z] = NMARR[z].blue/256;
    }

    int * poss = myCorrecter(ncor);
    dx = poss[0];
    dy = poss[1];


    static int moveRel[2];
    moveRel[0] = dx;
    moveRel[1] = dy;
	myMouseMove(pos[0]-dy, pos[1]-dx);
	if(!mapLocked){
	myXset();}
	return(moveRel);
}

struct cmdinfo{
	int colpx[3] = {0,0,0};
};
cmdinfo CMDINFO;

bool commanding = false;

std::string commandString = "";

void executeCommandString(std::string str){
	if(str == "heatmap"){
		heatMapToggle = !heatMapToggle;
		std::cout << ">heatmap toggled\n";
		return;
	} else if(str == "colgrab"){
		int * pos = myGetMousePos();
		XImage *image;
		image = XGetImage (dpy, XRootWindow (dpy, dfs), pos[0],pos[1], 1, 1, AllPlanes, XYPixmap);

	    XColor SCAN = getPix(0,0,image);
	    XFree (image);
	    XQueryColor (dpy, XDefaultColormap(dpy, dfs), &SCAN);
		std::cout << ">color grabbed: " << SCAN.red/256 << "-" << SCAN.green/256 << "-" << SCAN.blue/256 << "\n";
		CMDINFO.colpx[0] = SCAN.red/256;
		CMDINFO.colpx[1] = SCAN.green/256;
		CMDINFO.colpx[2] = SCAN.blue/256;
		return;
	} else if(str == "maplock"){
		mapLocked = !mapLocked;
		std::cout << ">maplock toggled\n";
		return;
	} else if(str == "aimprint"){
		mast.aimprint = !mast.aimprint;
		std::cout << ">aimprint toggled\n";
		return;
	} else if(str == "stopsound"){
		mast.stopsound = !mast.stopsound;
		std::cout << ">sound toggled\n";
		return;
	} else if(str == "setweapon"){
		mast.weaponSetter = 0;
		std::cout << ">setting weapon combination. press NUM5 to select\n";
		myPlay("AUDweaponset.wav",s1);
	} else if(str == "scan"){
		int * pos = myGetMousePos();
		XColor * scan = myXscan(pos[0],pos[1]);
		for(int j = 0; j < 20; j++){
			for(int i = 0; i < 20; i++){
				std::cout << myHeatDict2(scan[i+j*20].red/256);
			}
			std::cout<<"\n";
		}

	} else if(str == "time.now()" || str == "tnow" || str == "time.now" || str == "time"){
		std::cout << ">time now is: " << timeNow() << std::endl;
		return;
	}
}

void endCommand(){
	std::cout << "\n==command==\n"+commandString+"\n will be executed \n";


	executeCommandString(commandString);

	// while(commandString.length > 0){
	// 	std:string executeSnippet;
	// 	executeCommandString(executeSnippet);
	// 	commandString.erase(0,executeSnippet.length)
	// }

	commandString = "";
	commanding = false;
	myPlay("execute.wav",s1);
}
void updateCommand(int x){
	if(keyMap.count(x)){
		commandString = commandString + keyMap[x];
	} else if(x == 14){
		if(commandString.length() > 0){
			commandString.pop_back();
		}
	} else if(x == 28){
		endCommand();
	} else if(x == 53){
		std::cout << "\n>=command=<\n>"+commandString+"<\n";
	}

}




int keysounds = 1;
//0: none, 1: apx

void myDo(int x,std::string s1){


	if(x == 98){ 
		std::cout << "returning to mouse speed -0.75\n";
		system("xinput --set-prop \"PixArt Microsoft USB Optical Mouse\" \"libinput Accel Speed\" -0.75");
		system("xinput --set-prop \"PixArt Microsoft USB Optical Mouse\" \"Coordinate Transformation Matrix\" 1 0 0 0 1 0 0 0 1");
		myPlay("allClose.wav",s1);
		exit(0);
	}

	if(lastKey == x){
		keyRepeats += 1;
	} else {
		keyRepeats = 1;
		lastKey = x;
	}

	if(x == 53 && keyRepeats%3==0){
		if(commanding){
			endCommand();
		} else {
			myPlay("command.wav",s1);
			std::cout << "\n entering command mode \n";
			commanding = true;
		}
		return;
	}

	if(commanding){
		myPlay("command"+std::to_string((rand()%5)+1)+".wav",s1);
		updateCommand(x);
		return;
	}

	if(x == 78){
		
		if(keyRepeats%2 == 0){
			myPlay("close.wav",s1);
			inputMode = 0;
			return;
		}
		myPlay("AUDinput.wav",s1);
		inputMode = -1;
	} else if(inputMode == -1){
		if(x == 82){
			inputMode = 0;
			myPlay("close.wav",s1);
		} else if(x == 79){
			inputMode = 1;
			myPlay("ding2.wav",s1);
		} else if(x == 80){
			inputMode = 2;
			myPlay("AUDrecoil.wav",s1);
		} else {
			inputMode = 0;
			return;
		}
	} else if(x == 74){
		if(extraSlow == false){
			extraSlow = true;
			myPlay("bitExtLow.wav",s1);
			system("xinput --set-prop \"PixArt Microsoft USB Optical Mouse\" \"Coordinate Transformation Matrix\" 0.1 0 0 0 0.1 0 0 0 1");
		} else {
			extraSlow = false;
			system("xinput --set-prop \"PixArt Microsoft USB Optical Mouse\" \"Coordinate Transformation Matrix\" 1 0 0 0 1 0 0 0 1");
		}
	} else if(inputMode == 1){
		 if(x == 71){
			myPlay("bitLow.wav",s1);
			system("xinput --set-prop \"PixArt Microsoft USB Optical Mouse\" \"libinput Accel Speed\" -1");
		} else if(x == 72){
			system("xinput --set-prop \"PixArt Microsoft USB Optical Mouse\" \"libinput Accel Speed\" -0.75");
			myPlay("bitMid.wav",s1);
		} else if(x == 73){
			system("xinput --set-prop \"PixArt Microsoft USB Optical Mouse\" \"libinput Accel Speed\" -0.3");
			myPlay("bitHigh.wav",s1);
		} else if(x == 77 ){
			system("xinput --set-prop \"PixArt Microsoft USB Optical Mouse\" \"libinput Accel Speed\" 1");
			myPlay("bitHigh.wav",s1);
		}
	} else if(x == 55){
		system("xinput --set-prop \"PixArt Microsoft USB Optical Mouse\" \"libinput Accel Speed\" -0.75");
		system("xinput --set-prop \"PixArt Microsoft USB Optical Mouse\" \"Coordinate Transformation Matrix\" 1 0 0 0 1 0 0 0 1");
		extraSlow = false;
		myPlay("allClose.wav",s1);
	} else if(x == 50){
		myMouseMove(1000,700);
		myPlay("map.wav",s1);
	} else if(inputMode == 2){//antirecoil 
		if(x == 71){
			mast.downMode = mast.weaponSet[0];
			myPlay(mast.ASTsounds[mast.downMode-1],s1);
		} else if(x == 72){
			mast.downMode = mast.weaponSet[1];
			myPlay(mast.ASTsounds[mast.downMode-1],s1);
		} else if(x == 73){
			mast.downMode = mast.weaponSet[2];
			myPlay(mast.ASTsounds[mast.downMode-1],s1);
		} else if(x == 77){
			if(mast.downMode < mast.weaponCount){
				mast.downMode += 1;
			} else {
				mast.downMode = 1;
			}
			myPlay(mast.ASTsounds[mast.downMode-1],s1);
			std::cout << mast.ASTsounds[mast.downMode-1]<<"\n";
		} else if(x == 76){

			if(mast.weaponSetter < 3){

			mast.weaponSet[mast.weaponSetter] = mast.downMode;
			std::cout<<"set weapon ["<<mast.downMode<<"] to slot ["<<mast.weaponSetter<<"]\n";
			myPlay("ding2.wav",s1);
			mast.weaponSetter++;
			} else if(keyRepeats == 3){
				mast.weaponSetter = 0;
				std::cout << "setting weapon combination. press NUM5 to select\n";
				myPlay("AUDweaponset.wav",s1);
			}
		} else if(x == 75 ){
			if(mast.downMode > 1){
				mast.downMode -= 1;
			} else {
				mast.downMode = mast.weaponCount;
			}
			myPlay(mast.ASTsounds[mast.downMode-1],s1);
		}
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
		}else if(x == 47){
			myPlay("Punch.wav",s1);
		} else if(x == 45){
			
			mast.firedown = !mast.firedown;
			if(mast.firedown){
				myPlay("ding2.wav",s1);
			} else {
				myPlay("AUDmanual.wav",s1);
			}
		} else if (x == 46){
			scanr();
		}
	} else if(keysounds == 0){
		if(x == 45){
			int * pos = myGetMousePos();
			std::cout<<"xMousepos: "<<pos[0] << "-"<<pos[1]<<std::endl;
			myXaim();
		
		} else if(x == 46){
			myXset();
		}
	}
}

void arrAverager2D(XColor scan[],int width, int height){

	float averaged1D[height*2];
	for(int i = 0; i < height; i++){
		float av = 0;
		float av2 = 0;
		for(int j = 0; j < width; j++){
			av += scan[i*width+j].red;
			av2 += (scan[i*width+j].red)*j;
		}
		averaged1D[i] = av2/av;
		averaged1D[i+height] = av;
	}

	float actX;
	for(int i = 0; i < height; i++){
		averaged1D[i];
	}

	

}

void arrVectorAverager2D(XColor scan[],int width, int height){

	float vectorField[width*height];
	float moveVector[2] = {0,0};

	for(int i = 0; i < height; i++){
		for(int j = 0; j < width; j++){
			float pxval = scan[i*width+j].red;
			moveVector[0] += pxval * (j - width/2);
			moveVector[1] += pxval * (i - height/2);
		}
	}

}

void scanr(){
	const int scanx = 100;
	const int scany = 100;
	int pos[2] = {920,540};
	XColor SCAN [scanx*scany];
    XImage *image;
	image = XGetImage (dpy, XRootWindow (dpy, dfs), pos[0]-scanx/2,pos[1]-scany/2, scanx, scany, AllPlanes, XYPixmap);
    for(int y = 0; y < scany; y+=1){
        for(int x = 0; x < scanx; x+=1){
            int coor = x+y*scanx;
            SCAN[coor] = getPix(x,y,image);
        }
    }
    XFree (image);
    XQueryColors (dpy, XDefaultColormap(dpy, dfs), SCAN, scanx*scany);
    arrAverager2D(SCAN,scanx,scany);
}


void repeating(){
	return;
}
void recoilReader(int xarr[100][3],int size, int device){
	
    struct pollfd fds[1];
    fds[0].fd = device;
    fds[0].events = POLLIN;

	for(int i = 0; i < size; i++){
	
			if(xarr[i][0] == 0){
				break;
			}
			bool stop = false;
						while(poll(fds,1,0)){
							if((fds[0].revents & POLLIN)){
				    		input_event ev;
				    		ssize_t s = read(fds[0].fd, &ev, sizeof(input_event));
				           if (s == -1){
				               std::cout<<"error\n";
				           }
				           if(ev.type == EV_KEY && ev.value == 0 && ev.code == BTN_MOUSE){
					   		std::cout << "breaking: mouse is up\n";
				
					   		stop=true;
					   		break;
				           } else {
	
				           }
				    	}
						}
						if(stop){break;}//im genius

			std::this_thread::sleep_for(std::chrono::milliseconds(xarr[i][0]));
			int * pos = myGetMousePos();
			if(mast.aimprint){
				std::cout << "aiming: "<<xarr[i][1]<<" = "<<xarr[i][2]<<"\n";
			}
			myMouseMove(pos[0]+xarr[i][1], pos[1]+xarr[i][2]);
	}
}
void myMouseThread(){
	char devname[] = "/dev/input/event3";
    int device = open(devname, O_RDONLY);
    struct input_event ev;

    signal(SIGINT, INThandler);



	while(true){

		read(device,&ev, sizeof(ev));
        if(ev.type == EV_KEY && ev.value == 1 && ev.code == BTN_MOUSE && mast.firedown){

        	long long int t1 = (ev.time.tv_sec*1000000+ev.time.tv_usec);

        	long long int t2 = timeNow()*1000;
 
        	if(abs(t1-t2) > 500000){
        		std::cout<< "kill1\n";
        		continue;
        	}

            std::cout << "dragging down" << "\n";
 
			recoilReader(*mast.ASTs[mast.downMode-1],100,device);
        }

	}
}


int main()
{

	std::cout << "\n\n\neventX keyboard matches check\n";
	std::system("ls -l /dev/input/by-id/ | grep -e '600-event-kbd' -e 'event-mouse' | cut -c 25-");
	std::cout << "\ncurrent keyboard and mouse eventX used: "+std::to_string(keyboardEventX)+" - "+std::to_string(mouseEventX);
	std::cout << "\nverify correct device is being used for input\n\n\n";

	// d = XOpenDisplay((char *) NULL);
	dpy = XOpenDisplay(NULL);
	root_window = XRootWindow(dpy, 0);

	//test
	dfs = XDefaultScreen(dpy);
		// w = XCreateSimpleWindow(dpy, XRootWindow(dpy,dfs),10,10,100,100,1,BlackPixel(dpy,dfs),WhitePixel(dpy,dfs));
		// XSelectInput(dpy,w, ExposureMask | KeyPressMask);
		// XMapWindow(dpy,w);
	//test


	for(int z = 0; z < scanRes; z++){
		ocor[z] = 0;
	}
	//xlib stuff

		remove("text.txt");
		system("xinput --list-props \"PixArt Microsoft USB Optical Mouse\" >> text.txt");
		system("xinput --set-prop \"PixArt Microsoft USB Optical Mouse\" \"libinput Accel Speed\" -0.75");
		std::cout << "properties file updated.\nmouse speed set to -0.75 (default value 22apr23)" << std::endl;
		std::cout << "Parent Process id : " << getpid() << std::endl;
		s1 = std::getenv("SUDO_UID");
		std::cout << s1 << " is the current user ID \n\n";

		// int G = system("sudo -u '#1002' XDG_RUNTIME_DIR=/run/user/1002 aplay start.wav >>/dev/null 2>>/dev/null &");
        char devname[] = "/dev/input/event2";
        int device = open(devname, O_RDONLY);
        struct input_event ev;

        signal(SIGINT, INThandler);
        // uint64_t lastTime = timeNow();


        XEvent e;
        std::thread mtrd(myMouseThread);
        while(1)
        {


        	
	        	// XNextEvent(dpy,&e);
        		// std::cout<<"beraerear\n";
                read(device,&ev, sizeof(ev));
                if(ev.type == 1 && ev.value == 1){

                        myDo(ev.code,s1);
                        std::cout << "Key: " << ev.code << " State: " << ev.value << std::endl;
                }

		     //            uint64_t now = timeNow();
		     //            if(now != lastTime){
							// lastTime = now;
							// repeating();
			    //     		// XFillRectangle(dpy,w,DefaultGC(dpy,dfs),20,20,10,10);
		     //            }

        }
        XCloseDisplay(dpy);
        return 0;
}



//matrix correlation
//Eye tracker aim bot
//suvat equa
//link to different files

//g++ -c test.cpp -lX11&&g++ test.o -o sfml-app -lsfml-graphics -lsfml-window -lsfml-system -lX11 && sudo ./sfml-app