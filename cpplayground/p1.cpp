

#include <iostream>
#include <string>
#include <map>



void d1(){
  using namespace std;
  cout << "test";
}


void d2(){
  using namespace std;
  map<string, string> dict= {
    {"hi","hello "} 
  };

  cout << dict["hi"];

}



int main(){
  d2();
}
