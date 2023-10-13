// #include <stdlib.h>
#include <iostream>
#include <chrono> 
#include <thread>




#include <stdio.h>
#include <fcntl.h>
#include <linux/input.h>
// #include <sys/types.h>
#include <unistd.h>
#include <cmath>
#include <signal.h>
#include <stdlib.h>
// #include <list>
#include <vector>
#include <poll.h>

#include <map>
#include <iostream>
#include <SFML/Graphics.hpp>
#include <X11/Xlib.h>
#include <X11/Xutil.h>
#include <X11/Xatom.h>
#include <cstring>


//STUFF
#include <X11/extensions/XTest.h>
#include <X11/extensions/shape.h>
#include <X11/extensions/Xfixes.h>

#include <cairo.h>
#include <cairo-xlib.h>

//STUFF


std::string s1;
cairo_t* cr;

int Width = 1920*2;
int Height = 1080*2;

struct myDrawConst{
	std::string id = "NONE";
	std::string type = "RECT";
	bool render = false;
	int ints[10];
	float floats[10];
	std::string strings[10];
	int life = 70;
};

//instanciate


// struct myRectStruct

class myScreenC{
public:
	myDrawConst drawArr1[150];
	std::vector<myDrawConst> drawArr;
};
myScreenC myScreen;

std::map<int, char> keyMap = {
    { 16, 'q' },{ 17, 'w' },{ 57, ' ' },
    { 18, 'e' },{ 19, 'r' },{ 20, 't' },{ 21, 'y' },{ 22, 'u' },{ 23, 'i' },{ 24, 'o' },{ 25, 'p' },
    { 30, 'a' },{ 31, 's' },{ 32, 'd' },{ 33, 'f' },{ 34, 'g' },{ 35, 'h' },{ 36, 'j' },{ 37, 'k' },{ 38, 'l' },
    { 44, 'z' },{ 45, 'x' },{ 46, 'c' },{ 47, 'v' },{ 48, 'b' },{ 49, 'n' },{ 50, 'm' },{ 26, '[' },{ 27, ']' },
    { 43, 'S'},{ 2, '1'},{ 3, '2'},{ 4, '3'},{ 5, '4'},{ 6, '5'},{ 7, '6'},{ 8, '7'},{ 9, '8'},{ 10, '9'},{ 11, '0'},{39,';'},{52,'.'},{51,','}


};
//79 80 81
//75 76 77
//71 72 73

std::vector<std::string> split(std::string str,std::string delimiter){
	std::vector<std::string> t;

	size_t pos = 0;
	std::string token;
	while ((pos = str.find(delimiter)) != std::string::npos) {
	    token = str.substr(0, pos);
	    t.push_back(token);
	    str.erase(0, pos + delimiter.length());
	}
	t.push_back(str);

    // for(int i = 0; i < t.size(); i++){
    //     std::cout<<t[i]<<"\n";
    // }
	return(t);
}

void myRect(cairo_t *cr, int x, int y, int w, int h, float r, float g, float b, float a = 1, bool O = false){
	// cairo_save(cr);
	cairo_set_source_rgba(cr, r,g,b,a);
	if(O){
		cairo_set_operator (cr, CAIRO_OPERATOR_SOURCE);
    } else{
    	cairo_set_operator (cr, CAIRO_OPERATOR_OVER);
    }



    cairo_rectangle(cr, x, y, w, h);
    

    cairo_fill(cr);

    return;
    // cairo_restore (cr);
}
void myPix(cairo_t *cr, int x, int y, int z, float r, float g, float b, float a = 1, bool O = false){
	cairo_set_source_rgba(cr, r,g,b,a);
	cairo_move_to(cr, x,y);
    cairo_line_to(cr, x+z,y);
    if(O){
		cairo_set_operator (cr, CAIRO_OPERATOR_SOURCE);
    } else{
    	cairo_set_operator (cr, CAIRO_OPERATOR_OVER);
    }
    cairo_set_line_width(cr, 1);
    cairo_stroke(cr);
    return;
}

void scanr();
void AK(std::string str);
void recoilReader(int xarr[100][3], int size);

struct AST{
	bool firedown = false;
	bool aimprint = true;
	bool stopsound = false;
	bool keyCord = false;

	bool Rjump = true;

	bool autoK = true;

	double RSscale = 1;

	std::string autokStore = "";

	int downMode = 1;
	int weaponSetter = 3;
	int weaponSet[3] = {8,7,11};
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
	int havocAST[100][3] = {{500,-2,10},{90,-2,10},{90,-2,10},{90,1,6},{100,1,5},{100,2,6},{100,2,5},{90,1,5},{90,0,5},{90,0,5},{90,-3,0},{90,-3,0},{90,-3,0},{90,-3,0},{90,0,5},{90,3,0},{90,3,0},{90,4,0},{90,4,2},{90,0,4},{90,0,4},{90,0,4},{90,0,3},{90,0,3},{90,0,3},{90,0,3},{90,0,3},{90,0,3},{90,0,3},{90,0,3},{90,0,3}};
	int devotionAST[100][3] = {{20,0,22},{250,0,14},{170,0,13},{150,1,9},{110,2,7},{90,2,6},{90,2,5},{90,2,4},{90,2,4},{90,2,4},{90,2,4},{90,4,3},{90,4,2},{90,4,2},{90,4,2},{90,4,2},{90,2,4},{90,-4,3},{90,-4,3},{90,-4,3},{90,-3,2},{90,-3,3},{90,-3,2},{90,-3,3},{90,-3,2},{90,-3,3},{90,-3,2},{90,-3,2},{90,-3,3},{90,-3,3},{90,-3,2}};
	int jitterAST[100][3] = {{50,7,0},{20,-7,0},{140,7,0},{20,-7,0},{20,-7,0},{140,7,0},{140,7,0},{20,-7,0},{20,-7,0},{140,7,0},{140,7,0},{20,-7,0},{20,-7,0},{140,7,0},{140,7,0},{20,-7,0},{20,-7,0},{140,7,0},{140,7,0},{20,-7,0},{20,-7,0},{140,7,0},{140,7,0},{20,-7,0},{20,-7,0},{140,7,0},{140,7,0},{20,-7,0},{20,-7,0},{140,7,0},{140,7,0},{20,-7,0},{20,-7,0},{140,7,0}};

	const static int weaponCount = 12;
	int (*ASTs[weaponCount])[100][3] = {&jitterAST,&devotionAST,&prowlerAST,&nemesisAST,&carAST,&r99AST,&flatlineAST,&rampageAST,&spitfireAST,&lstarAST,&re45AST,&havocAST};
	std::string ASTsounds[weaponCount] = {"","","AUDprowler.wav","AUDnemesis.wav","AUDcar.wav","AUDr99.wav","AUDflatline.wav","AUDrampage.wav","AUDspitfire.wav","AUDlstar.wav","",""};
	//prowler, nemesisx
};
AST mast;

int inputMode = 0;
int lastKey = 400;
int keyRepeats = 0;


int keyboardEventX = 4;
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
void myMouseMove(int x, int y){
	int * pos = myGetMousePos();
    // XWarpPointer(dpy,None,root_window,0,0,0,0,x,y);
    XTestFakeRelativeMotionEvent(dpy, x - pos[0], y - pos[1], 0);
    XSync(dpy, false);
    XFlush(dpy);
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
	XColor scanArr[res+xwid]; /// ??????!!!!!???
	static XColor *scanArrP = scanArr;
	XImage *image;
    image = XGetImage (dpy, XRootWindow (dpy, dfs), xstart,ystart, xwid*xskip, ywid*yskip, AllPlanes, XYPixmap);

	for(int i = 0; i < xwid; i++){
		for(int j = 0; j < ywid; j++){
			scanArr[i+j*xwid] = getPix(i*xskip,j*yskip,image);
		}
	}
    XFree(image);

    XQueryColors (dpy, XDefaultColormap(dpy, dfs), scanArr, res);
    return(scanArrP);
}

void imageContrast(XColor * carr, int xwid, int ywid){
	int res = xwid*ywid;
	int outarr[res];
	for(int i = 0; i < xwid; i++){
		for(int j = 0; j < ywid; j++){
			
		}

	}

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


void scx(std::string x1,std::string x2,std::string x3,std::string x4 = ""){
				auto start = std::chrono::high_resolution_clock::now();
    		// operation to be timed ...

			int * pos = myGetMousePos();
			int resX = 200;
			int resY = 200;
			if(x1 == ""){
				x1 = "1";
			}
			if(x3 == ""){
				x3 = "1";
			}
			int res =  stoi(x1);
			float alp = stof(x3);
			XColor * scan = myXscan(pos[0]-resX/2*res,pos[1]-resY/2*res,resX,resY,res,res);
			std::cout << "xscan done\n";
			for(int j = 0; j < resY; j++){
				float DDX = -1;
				for(int i = 0; i < resX; i++){
					// std::cout << myHeatDict2(scan[i+j*resX].red/256);
					float dx;
					if(x2 == "blue" || x2 == "b"){
						 dx = static_cast <float> (scan[i+j*resX].blue/static_cast <float>(65536));
					} else if(x2 == "green" || x2 == "g"){
						 dx = static_cast <float> (scan[i+j*resX].green/static_cast <float>(65536));
					} else {
						 dx = static_cast <float> (scan[i+j*resX].red/static_cast <float>(65536));
					}
					if(DDX-0.05 <= dx && dx <= DDX+0.05){
						if(x4 == ""){
						myScreen.drawArr[myScreen.drawArr.size()-1].ints[2] += res;
						}
						continue;
					}
					DDX = dx;
					myDrawConst t;
					t.type = "RECT";
					t.ints[0] = pos[0]- (resX/2-i)*res;
					t.ints[1] = pos[1]- (resY/2-j)*res;
					t.ints[2] = res;
					t.ints[3] = res;

					if(x2 == "blue" || x2== "b"){
					t.floats[0] = 0;
					t.floats[1] = 0;
					t.floats[2] = dx;
					} else if(x2== "green" ||x2 == "g"){
					t.floats[0] = 0;
					t.floats[1] = dx;
					t.floats[2] = 0;
					} else {
					t.floats[0] = dx;
					t.floats[1] = 0;
					t.floats[2] = 0;
					}
					
					t.floats[3] = alp;
					myScreen.drawArr.push_back(t);
				}
			}
			      	 auto finish = std::chrono::high_resolution_clock::now();
    	std::cout << std::chrono::duration_cast<std::chrono::nanoseconds>(finish-start).count() << "ns, drawing size: \n";
 
}


struct cmdinfo{
	int colpx[3] = {0,0,0};
};
cmdinfo CMDINFO;

bool commanding = false;

std::string commandString = "";

void executeCommandString(std::string str){



	std::string str2 = str;
	std::vector<std::string> spl = split(str2," ");



	if(str == "help"){ 
		std::cout << "> === help === \n";
		std::cout << "> [heatmap] toggle heatmap\n";
		std::cout << "> [colgrab] pixel color at cursor\n";
		std::cout << "> [cap/screencap/screenshot] screencapture\n";
		std::cout << "> [maplock] toggle maplock\n";
		std::cout << "> [aimprint] toggles printout for mouse movement when stabalizing\n";
		std::cout << "> [stopsound] toggles sound\n";
		std::cout << "> [setweapon] sets the weapon combinations (press 5 to set)\n";
		std::cout << "> [time/tnow/time.now] gives times in epoch ms\n";
		std::cout << "> [keycord] records all key events\n";
		std::cout << "> [autok] toggle autokeys and fills things (default false)\n";
		std::cout << "> [scan] print out an askii of xscan (red)\n";
		std::cout << "> [scanx] <int> <r/g/b> <int> <char> render out a pixmap of xscan\n";
		std::cout << "> [rjump] toogles r for spam jump\n";
		std::cout << "> [scale] <double> scales reader by number";
		std::cout << "> [list] list all eventx inputs\n";
		std::cout << "> === help ===\n\n";
	}
	else if(str == "heatmap"){
		heatMapToggle = !heatMapToggle;
		std::cout << ">heatmap toggled: "<< heatMapToggle <<"\n";
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
	} else if(str == "screencap" || str == "screenshot" || str == "cap"){
		std::string s2 = ("sudo -u '#" + s1 +"' XDG_RUNTIME_DIR=/run/user/" + s1 + " gnome-screenshot &");
		std::system(s2.c_str());
	} else if(str == "list"){
		std::system("ls -l /dev/input/by-id/");
	} else if(str == "maplock"){
		mapLocked = !mapLocked;
		std::cout << ">maplock toggled: "<< mapLocked <<"\n";
		return;
	} else if(str == "aimprint"){
		mast.aimprint = !mast.aimprint;
		std::cout << ">aimprint toggled: "<< mast.aimprint <<"\n";
		return;
	} else if(str == "stopsound"){
		mast.stopsound = !mast.stopsound;
		std::cout << ">sound toggled: "<<mast.stopsound<<"\n";
		return;
	} else if(str == "setweapon"){
		mast.weaponSetter = 0;
		std::cout << ">setting weapon combination. press NUM5 to select\n";
		myPlay("AUDweaponset.wav",s1);
	} else if(str == "scan" || str == "scan red"){

		int * pos = myGetMousePos();
		int resX = 100;
		int resY = 40;
		XColor * scan = myXscan(pos[0]-resX/2,pos[1]-resY/2,resX,resY,2,3);
		for(int j = 0; j < resY; j++){
			for(int i = 0; i < resX; i++){
				std::cout << myHeatDict2(scan[i+j*resX].red/256);
			}
			std::cout<<"\n";
		}

	} else if(str == "time.now()" || str == "tnow" || str == "time.now" || str == "time"){

		std::cout << ">time now is: " << timeNow() << std::endl;
		return;

	} else if(str == "keycord"){
		mast.keyCord = !mast.keyCord;
		std::cout << ">keycording toggled: "<< mast.keyCord <<"\n";
		return;
	} else if (str == "autok"){
		mast.autoK = !mast.autoK;
		std::cout << ">autoK toggled: "<< mast.autoK <<"\n";
		system("xdotool key BackSpace BackSpace BackSpace BackSpace BackSpace BackSpace BackSpace BackSpace BackSpace BackSpace BackSpace");
		AK("test");
	} else if (str == "rjump"){
		mast.Rjump = !mast.Rjump;
		std::cout << ">Rjump toggled: "<< mast.Rjump <<"\n";
	} else if (spl[0] == "scale"){
		double scale = stod(spl[1]);
		mast.RSscale = scale;
	}





	if(spl.size() > 0){

		for(int i = 0; i < 5; i++){
			spl.push_back("");
		}

		if(spl[0] == "play"){
			myPlay(spl[1]+".wav",s1);
		} else if(spl[0] == "rect"){
			myDrawConst t;
			t.ints[0] = 500;
			t.ints[1] = 500;
			t.ints[2] = 500;
			t.ints[3] = 500;
			t.floats[0] = 1;
			t.floats[1] = 0;
			t.floats[2] = 0;
			t.floats[3] = 0.6;

			myScreen.drawArr.push_back(t);
			
			// for(int i = 0; i < 10000; i++){
			// myDrawConst t;
			// t.ints[0] = 2*(i%100);
			// t.ints[1] = int(i/100)*2;
			// t.ints[2] = 2;
			// t.ints[3] = 2;
			// t.floats[0] = 1;
			// t.floats[1] = 0;
			// t.floats[2] = 0;
			// t.floats[3] = 0.6;

			// myScreen.drawArr.push_back(t);
			// }
		} else if(spl[0] == "scanx"){///scanx
			scx(spl[1],spl[2],spl[3],spl[4]);
		}



	}


}

void endCommand(){
	std::cout << "\n==command==\n"+commandString+"\n will be executed \n";

	std::string delimiter = ";";

	size_t pos = 0;
	std::string token;
	while ((pos = commandString.find(delimiter)) != std::string::npos) {
	    token = commandString.substr(0, pos);
	    executeCommandString(token);
	    commandString.erase(0, pos + delimiter.length());
	}
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
	} else if(keyRepeats == 2){
		endCommand();
	}

}


void pressShiftKey()
{
    KeyCode shiftKeyCode = XKeysymToKeycode(dpy, XK_Shift_L);
    XTestFakeKeyEvent(dpy, shiftKeyCode, True, CurrentTime);
    XFlush(dpy);
}

// Simulate releasing the Shift key
void releaseShiftKey()
{
    KeyCode shiftKeyCode = XKeysymToKeycode(dpy, XK_Shift_L);
    XTestFakeKeyEvent(dpy, shiftKeyCode, False, CurrentTime);
    XFlush(dpy);
}

int keysounds = 0;
//0: none, 1: apx

void myDo(int x,std::string s1){


	if(x == 98){ 
		std::cout << "returning to mouse speed 0\n";
		system("xinput --set-prop \"PixArt Microsoft USB Optical Mouse\" \"libinput Accel Speed\" 0");
		system("xinput --set-prop \"PixArt Microsoft USB Optical Mouse\" \"Coordinate Transformation Matrix\" 1 0 0 0 1 0 0 0 1");
		std::cout << "\nKrd closed at " << timeNow() << "\n";
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
		system("xinput --set-prop \"PixArt Microsoft USB Optical Mouse\" \"libinput Accel Speed\" 0");
		system("xinput --set-prop \"PixArt Microsoft USB Optical Mouse\" \"Coordinate Transformation Matrix\" 1 0 0 0 1 0 0 0 1");
		extraSlow = false;
		myPlay("allClose.wav",s1);
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
			myPlay("allClose.wav",s1);
			keysounds = 0;
		}
	}


	if(keysounds == 1){
		if(x == 19 ){
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
		} else if(x == 50){
			myMouseMove(1000,700);
			myPlay("map.wav",s1);
		} else if(x == 36){
		// 	scx("1","b","0.5","3");
		// 	myPlay("map.wav",s1);
		// } else if(x == 37){
		// 	scx("1","g","0.5","3");
		// 	myPlay("map.wav",s1);
		// } else if(x == 38){
		// 	scx("1","r","0.5","3");
		// 	myPlay("map.wav",s1);
		} else if(x == 45 && keyRepeats%3 == 0){
			
			mast.firedown = !mast.firedown;
			if(mast.firedown){
				myPlay("ding2.wav",s1);
			} else {
				myPlay("AUDmanual.wav",s1);
			}
		} else if (x == 46){
			scanr();
		} else if(x == 20 && mast.Rjump){
			// system("xdotool key space");
			// usleep(16);
			// system("xdotool keydown shift &");
			// pressShiftKey();
			system("xdotool click 5 && sleep 0.05 && xdotool click 5 &");
		} else if(x == 57){
			if(!mast.stopsound){
				// std::string s2 = "dummy=$(sleep 2 && sudo -u '#" + s1 +"' XDG_RUNTIME_DIR=/run/user/"+s1+" aplay jumpDing.wav 2>/dev/null) &";
				// int i3 = std::system(s2.c_str());
			}

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

void myDoU(int x){
	if(keysounds == 1){
		if(x == 20 && mast.Rjump){
			std::cout << "upped\n";
			// system("xdotool keyup shift &");
			// releaseShiftKey();
			system("xdotool click 5 &");
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
	double scale = mast.RSscale;
    struct pollfd fds[1];
    fds[0].fd = device;
    fds[0].events = POLLIN;

	for(int i = 0; i < size; i++){
	
			if(xarr[i][0] == 0){
				break;
			}
			bool stop = false;
			std::this_thread::sleep_for(std::chrono::milliseconds(xarr[i][0]));

						while(poll(fds,1,0)){
							if((fds[0].revents & POLLIN)){
				    		input_event ev;
				    		ssize_t s = read(fds[0].fd, &ev, sizeof(input_event));
				           if (s == -1){
				               std::cout<<"error\n";
				           }
				           // std::cout << ev.type << "-" << ev.value << "-" << ev.code << "\n";
				           if(ev.type == EV_KEY && ev.value == 0 && ev.code == BTN_MOUSE){
					   		std::cout << "breaking: mouse is up\n";
				
					   		stop=true;
					   		break;
				           } else {
	
				           }
				    	}
						}
						if(stop){break;}//im genius

			int * pos = myGetMousePos();
			if(mast.aimprint){
				std::cout << "aiming: "<<xarr[i][1]<<" = "<<xarr[i][2]<< "scale: " << scale <<"\n";
			}
			myMouseMove(static_cast<int>(std::round(pos[0]+xarr[i][1]*scale)), static_cast<int>(std::round(pos[1]+xarr[i][2]*scale)));
	}
}
void myMouseThread(){
	char devname[] = "/dev/input/event";
	char mouseEX[64];
	sprintf(mouseEX, "%d", mouseEventX);
	strcat(devname, mouseEX);


    int device = open(devname, O_RDONLY);
    struct input_event ev;

    signal(SIGINT, INThandler);



	while(true){

		read(device,&ev, sizeof(ev));
		// std::cout << ev.value << " - "<< ev.type << " - "<< ev.code <<"\n";
        if(ev.type == EV_KEY && ev.value == 1 && ev.code == BTN_MOUSE && mast.firedown){

        	long long int t1 = (ev.time.tv_sec*1000000+ev.time.tv_usec);

        	long long int t2 = timeNow()*1000;
 
        	if(abs(t1-t2) > 500000){
        		std::cout<< "kill1\n";
        		continue;
        	}
        	int * pos = myGetMousePos();
            std::cout << "dragging down from: "<< pos[0] << "=" << pos[1] << "\n";
 
			recoilReader(*mast.ASTs[mast.downMode-1],100,device);
        }

	}
}







// class myDrawParticle{
// public:
// 	int life;


// 	void myDrawParticle(int ix1, int iy1, int iw, int ih, int ii1){
// 		life = ii1;
// 	};

// 	void draw(){

// 	}
// }


void myScreenThread(){
	//dpy, root_window, dfs

    XSetWindowAttributes attrs;
    attrs.override_redirect = true;
    XVisualInfo vinfo;
    if (!XMatchVisualInfo(dpy, DefaultScreen(dpy), 32, TrueColor, &vinfo)) {
        printf("No visual found supporting 32 bit color, terminating\n");
    }
    // these next three lines add 32 bit depth, remove if you dont need and change the flags below
    attrs.colormap = XCreateColormap(dpy, root_window, vinfo.visual, AllocNone);
    attrs.background_pixel = 0;
    attrs.border_pixel = 0;

    Window overlay = XCreateWindow(
        dpy, root_window,
        0, 0, Width, Height, 0,
        vinfo.depth, InputOutput, 
        vinfo.visual,
        CWOverrideRedirect | CWColormap | CWBackPixel | CWBorderPixel, &attrs
    );

    XMapWindow(dpy, overlay);


    XRectangle rect;
	XserverRegion region = XFixesCreateRegion (dpy, NULL, 0);
	// XserverRegion region = XFixesCreateRegion(dpy, &rect, 1);
	XFixesSetWindowShapeRegion (dpy, overlay, ShapeBounding, 0, 0, 0);
	XFixesSetWindowShapeRegion(dpy, overlay, ShapeInput, 0, 0, region);
	XFixesDestroyRegion(dpy, region);


    
    // XFixesSetWindowShapeRegion (d, w, ShapeInput, 0, 0, region);

    // XFixesDestroyRegion (d, region);

    cairo_surface_t* surf = cairo_xlib_surface_create(dpy, overlay,
                                  vinfo.visual,
                                  Width, Height);
    cr = cairo_create(surf);

    //actual colrender
    bool confetti = false;
    if(confetti){
    for(int i = 0; i < 150; i++){
    	myScreen.drawArr1[i].id = "test";
		myScreen.drawArr1[i].render = true;
		myScreen.drawArr1[i].ints[0] = rand()%1800; 
		myScreen.drawArr1[i].ints[1] = rand()%1000; 
		// std::cout << myScreen.drawArr1[0].ints[1] << "\n";
		myScreen.drawArr1[i].ints[2] = rand()%40+10; 
		myScreen.drawArr1[i].ints[3] = 40; 
		myScreen.drawArr1[i].ints[4] = 0; 
		myScreen.drawArr1[i].ints[5] = 0; 
		myScreen.drawArr1[i].floats[0] = static_cast <float> (rand()) / static_cast <float> (RAND_MAX);;
		myScreen.drawArr1[i].floats[1] = static_cast <float> (rand()) / static_cast <float> (RAND_MAX);;
		myScreen.drawArr1[i].floats[2] = static_cast <float> (rand()) / static_cast <float> (RAND_MAX);;
		// myScreen.drawArr1[i].floats[0] = 1;
		// myScreen.drawArr1[i].floats[1] = 1;
		// myScreen.drawArr1[i].floats[2] = 1;
		myScreen.drawArr1[i].floats[3] = 0.5;
		}
    //actual colrender
	}

	XEvent ev;
    while(1){
  
    	cairo_push_group(cr);
    	// cairo_set_source_rgba(cr,0,0,0,0);
    	// cairo_set_operator(cr,CAIRO_OPERATOR_SOURCE);
    	// cairo_paint(cr);
    	// cairo_set_operator(cr,CAIRO_OPERATOR_OVER);
  //Colorrender
    	if(confetti){
    	for(int i = 0; i < 150; i++){
    	myScreen.drawArr1[i].id = "test";
		myScreen.drawArr1[i].render = true;
		myScreen.drawArr1[i].ints[0] += int(myScreen.drawArr1[i].floats[4]); 
		myScreen.drawArr1[i].ints[1] += int(myScreen.drawArr1[i].floats[5]); 

		myScreen.drawArr1[i].floats[4] += static_cast <float> (rand()) / static_cast <float> (RAND_MAX); 
		myScreen.drawArr1[i].floats[5] += static_cast <float> (rand()) / static_cast <float> (RAND_MAX);
		myScreen.drawArr1[i].floats[4] -= 0.5;
		myScreen.drawArr1[i].floats[5] -= 0.5;

		if(myScreen.drawArr1[i].floats[4] > 5){
			myScreen.drawArr1[i].floats[4] = 5;
		}if(myScreen.drawArr1[i].floats[4] < -5){
			myScreen.drawArr1[i].floats[4] = -5;
		}

		if(myScreen.drawArr1[i].floats[5] > 50){
			myScreen.drawArr1[i].floats[5] = 50;
		}if(myScreen.drawArr1[i].floats[5] < 7){
			myScreen.drawArr1[i].floats[5] = 7;
		}


		if(myScreen.drawArr1[i].ints[0]>Width){
			myScreen.drawArr1[i].ints[0]=0;
		}
		if(myScreen.drawArr1[i].ints[0]<0){
			myScreen.drawArr1[i].ints[0]=Width;
		}
		if(myScreen.drawArr1[i].ints[1]>Height){
			myScreen.drawArr1[i].ints[1]=0;
		}
		// std::cout << myScreen.drawArr1[0].ints[1] << "\n";
		// myScreen.drawArr1[i].ints[2] = rand()%20+10; 
		// myScreen.drawArr1[i].ints[3] = 20; 
		// myScreen.drawArr1[i].floats[0] = static_cast <float> (rand()) / static_cast <float> (RAND_MAX);;
		// myScreen.drawArr1[i].floats[1] = static_cast <float> (rand()) / static_cast <float> (RAND_MAX);;
		// myScreen.drawArr1[i].floats[2] = static_cast <float> (rand()) / static_cast <float> (RAND_MAX);;
		}

    	for(int i = 0; i < 150; i ++){
    		myDrawConst shape = myScreen.drawArr1[i];
	    		if(myScreen.drawArr1[i].render == false || myScreen.drawArr1[i].id == "none"){
	    			continue;
	    		}
	    		if(shape.type == "RECT"){
	    			myRect(cr,shape.ints[0],shape.ints[1],shape.ints[2],shape.ints[3],shape.floats[0],shape.floats[1],shape.floats[2],shape.floats[3]);
	    		}
    		}
    	}
  //Colorrender

    	//crosshair
    	float a = static_cast <float> (rand()) / static_cast <float> (RAND_MAX);
    	myRect(cr,Width/2,Height/2-40,2,80,0,a,1-a,0.9);
    	myRect(cr,Width/2-40,Height/2,80,2,0,a,1-a,0.9);

    	// myRect(cr,Width/2,Height/2-80,1,160,1,0,1);
    	// myRect(cr,Width/2-80,Height/2,160,1,1,0,1);

    // 	auto start = std::chrono::high_resolution_clock::now();
    // // operation to be timed ...
    //   	 auto finish = std::chrono::high_resolution_clock::now();
    // 	std::cout << std::chrono::duration_cast<std::chrono::nanoseconds>(finish-start).count() << "ns, drawing size: "<<size<<"\n";
 
    	int size = myScreen.drawArr.size();
    	for(int i = size-1; i > -1; i--){

    		myDrawConst shape = myScreen.drawArr[i];
    		myScreen.drawArr[i].life -= 1;
    		if(shape.life < 1){
    			myScreen.drawArr.erase(myScreen.drawArr.begin()+i);
    			continue;
    		}

    		if(shape.type == "RECT"){
    			myRect(cr,shape.ints[0],shape.ints[1],shape.ints[2],shape.ints[3],shape.floats[0],shape.floats[1],shape.floats[2],shape.floats[3]);
    		} else if (shape.type == "PIX"){
    			myPix(cr,shape.ints[0],shape.ints[1],shape.ints[2],shape.floats[0],shape.floats[1],shape.floats[2],shape.floats[3]);
    		}


    	}
    	// usleep(110);//10

    	// usleep(110);
    	// std::cout << "1\n";
    	// cairo_pop_group_to_source(cr);
    	// usleep(110);
    	// std::cout << "2\n";
    	// cairo_save(cr);
    	// usleep(110);
    	// std::cout << "3\n";
    	// myRect(cr,0,0,Width,Height,0,0,0,0,true);
    	// cairo_paint(cr);
    	// usleep(110);
    	// std::cout << "4\n";
    	// cairo_restore(cr);
    	// usleep(110);
    	// std::cout << "5\n";
    	// cairo_paint(cr);
    	// usleep(110);
    	// std::cout << "6\n";
    	// cairo_surface_flush(surf);
    	// usleep(110);
    	// std::cout << "7\n";
    	// XSync(dpy,false);
    	// usleep(110);
    	// std::cout << "8\n";
    	// XFlush(dpy);
    	// usleep(110);
    	// std::cout << "9\n";
    	// usleep(1);//50
    	// // return;

    	usleep(10);
    	cairo_pop_group_to_source(cr);
    	cairo_save(cr);
    	myRect(cr,0,0,Width,Height,0,0,0,0,true); //fills screen with transparent rectangle
    	cairo_restore(cr);
    	cairo_paint(cr);
    	XSync(dpy,false);
    	cairo_surface_flush(surf);
    	// XFlush(dpy);
    	usleep(50);
 
    }


    cairo_destroy(cr);
    cairo_surface_destroy(surf);

    XUnmapWindow(dpy, overlay);
    XCloseDisplay(dpy);
    return;
}


int main()
{
	XInitThreads();
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
		system("xinput --set-prop \"PixArt Microsoft USB Optical Mouse\" \"libinput Accel Speed\" 0");
		std::cout << "properties file updated.\nmouse speed set to 0 (default value 22apr23)" << std::endl;
		std::cout << "Parent Process id : " << getpid() << std::endl;
		s1 = std::getenv("SUDO_UID");
		std::cout << s1 << " is the current user ID \n\n";

		// int G = system("sudo -u '#1002' XDG_RUNTIME_DIR=/run/user/1002 aplay start.wav >>/dev/null 2>>/dev/null &");
		myPlay("start.wav",s1);
        char devname[] = "/dev/input/event";
        char integer_string[64];

		sprintf(integer_string, "%d", keyboardEventX);
		strcat(devname, integer_string);


        int device = open(devname, O_RDONLY);
        struct input_event ev;

        signal(SIGINT, INThandler);
        // uint64_t lastTime = timeNow();


        XEvent e;
        std::thread mtrd(myMouseThread);
        //PREFORMANCE ISSUES <- unfound eventX

        std::thread SCREEN(myScreenThread);


        while(1)
        {
        	// usleep(2);

        	
				
                read(device,&ev, sizeof(ev));
                if(mast.keyCord){
                	std::cout << "Keycord: " << ev.type << " - " << ev.code << " - " << ev.value << " \n";
                }
                if(ev.type == 1){
                	if(ev.value == 1){
                        myDo(ev.code,s1);
                        std::cout << "Key: " << ev.code << " State: " << ev.value << std::endl;
                    } else if(ev.value == 0){
                    	myDoU(ev.code);
                    	std::cout << "KeyU: " << ev.code << " State: " << ev.value << std::endl;
                    }

                    // {
                    	// std::cout << "Other: code:"<< ev.code << " State: " << ev.value << std::endl;
                    // }
                }



        }
        XCloseDisplay(dpy);
        return 0;
}
std::string AKchooser()
{
  int a;
  srand (time(NULL));

  const std::string stupids[31] = {
  "idiotic ",
  "moronic ","bloody unintelligent ","brain dead ",//4
  "vapid ","pig headed ","cretinous ","naive ","senseless ",//9
  // "homosexual ","gay",
  "degenerate ","aberrant ","delerious ","apeish ","puerile ","lame and dopey ", "uneducated ",//16
  "asinine ","unintellectual ","fallacious ","daft ","slow ", "obtuse ",//22
  "feeble ", "uneducated ","invalid ","inconsequential ","frivolous ","protohominid ","negligable ",//29
  "rancid ","primal brained "//31
};

const std::string adverbs[22]={
  "trivially ","horrendously ","heinously ","erroneously ","notably ","exceptionally ",
  "abnormally ","abhorrently ","atrociously ","direly ","hideously ","dreadfully ","awfully ","harrowingly ",
  "unbelievably ","improbably ","implausibly ","disturbingly ","excrutiatingly ", "catastrophically ","absurdly ",

  // 20sep :(
  "incomprehensibly "
};


  a = rand() % 31;
  int b = rand()%22;
  std::cout << adverbs[b] + stupids[a] + " " << std::endl;
  
  return (adverbs[b] + stupids[a] + " ");
}
void AK(std::string str){
	if(!mast.autoK){return;}
	std::string str2 = "xdotool type '"+AKchooser()+"'";
	system(str2.c_str());
}

void speak(std::string str){
	std::string str2 = "espeak -k20 '" + str + "' -a100 -s225";
	system(str2.c_str());
}


//matrix correlation
//Eye tracker aim bot
//suvat equa
//link to different files

//std system call of analyzing audio




//check:
//eventX <- int 
//Vector commands
//Vector rendering


//replace cal batteries





//g++ -c test.cpp -lX11&&g++ test.o -o sfml-app -lsfml-graphics -lsfml-window -lsfml-system -lX11 && sudo ./sfml-app
