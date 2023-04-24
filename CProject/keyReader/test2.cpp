
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


#include <iostream>
#include <SFML/Graphics.hpp>
#include <X11/Xlib.h>
#include <X11/Xutil.h>
#include <X11/Xatom.h>

void myPlay(){
	std::system("sudo -u '#1002' XDG_RUNTIME_DIR=/run/user/1002 aplay -q ding2.wav &");
}

int main(){
	std::cout<<"hello? this is me! \n";
	myPlay();
	std::cout<<"\ntest? why is this printing here?\n";
	std::cout<<"another test.\n";
	return 0;
}