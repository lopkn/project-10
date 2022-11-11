

#include <iostream>
#include <string>
#include <map>



void d1(){
  using namespace std;
  cout << "test";
}


//void d2(){
//  using namespace std;
//  map<string, string> dict= {
//    {"hi","hello "} 
//  };


//}

void d3(){
  using namespace std;
  bool repeat = true;
  double arr [100];
  int counter = 0;
  string operation = "e";
  while(repeat){
    if(operation == "e"){
    cout << "enter x and y variables \n";
    string sx;
    string sy;
    getline(cin, sx);
    double x = stod(sx);
    getline(cin, sy);
    double y = stod(sy);
    arr[counter] = x;
    arr[counter+1] = y;
    counter += 2;
    };


    cout << "operation? -> ";
    getline(cin, operation);
    if(operation == "exit"){
      repeat = false;
      cout << "terminating!\n";
    };
  };


}

int main(){
  d3();
}
