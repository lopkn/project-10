

#include <iostream>
#include <string>
#include <map>
#include <cmath>


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


float mrand(){
  return((float)rand() / (float)RAND_MAX);
};

class nur{
public:
  double act;
  double xpt;
  int actors;

  double knowns[20][4];
  int knownCounter = 0;

  double multipliers[3] = {0,0,0};

  double process(double inp[3],double expected,int learntimes){
    
    if(knownCounter < 20){
      // double a[4] = {inp[0],inp[1],inp[2],expected};
      knowns[knownCounter][0] = inp[0];
      knowns[knownCounter][1] = inp[1];
      knowns[knownCounter][2] = inp[2];
      knowns[knownCounter][3] = expected;
      knownCounter += 1;
    };


    double out = 0;
    for(int i = 0; i < 3; i++){
      out += inp[i]*multipliers[i];
    };

    double error = fabs(out-expected);
    // int rev = 1;
    // if(mrand()>0.5){
    //   rev = -1;
    // };


    double fe = learn(learntimes,error);



    // for(int i = 0; i < 3; i++){
    //   multipliers[i] += rev*mrand()*error*0.5;
    // };
    std::cout << "error: "<< fe <<"\n";
    std::cout << "multipliers: "<<multipliers[0]<<", "<<multipliers[1]<<", "<<multipliers[2]<<" |";

    return(inp[0]*multipliers[0]+inp[1]*multipliers[1]+inp[2]*multipliers[2]);
  };

  double evaluate(double inp[3],double multiplier[3],double expected){
    double out = 0;
    for(int i = 0; i < 3; i++){
      out += inp[i]*multiplier[i];
    };

    double error = fabs(out-expected);
    return(error);
  };

  double evaluateAll(double multiplier[3]){
    double currentError = 0;
    for(int i = 0; i < knownCounter; i++){
      double a[3] = {knowns[i][0],knowns[i][1],knowns[i][2]};
      currentError += evaluate(a,multiplier,knowns[i][3]);
    };
    return(currentError);
  };

  double learn(int times, double error){

    double temp[3] = {multipliers[0],multipliers[1],multipliers[2]};

    double currentError = evaluateAll(temp);


    int changes = 0;


    for(int i = 0; i < times; i++){

    int rev = 1;
    if(mrand()>0.5){
      rev = -1;
    };

    double Tmultipliers[3] = {multipliers[0],multipliers[1],multipliers[2]};

    int R = std::floor(mrand()*3);
    // for(int i = 0; i < 3; i++){
      Tmultipliers[R] += rev*mrand()*error*0.5;
    // };

    double newError = evaluateAll(Tmultipliers);
    if(newError < currentError){
      multipliers[0] = Tmultipliers[0];
      multipliers[1] = Tmultipliers[1];
      multipliers[2] = Tmultipliers[2];
      currentError = newError;
      changes += 1;
    };

  };
  std::cout<<"\nchanged: "<<changes<<" times\n";

  return(currentError);

  };

};

int main(){
  nur n1;
  using namespace std;
  while(true){

    cout << "what do you want it to learn? -> \n";
    string in1;
    string in2;
    string in3;
    string in4;

    getline(cin, in1);
    getline(cin, in2);
    getline(cin, in3);
    getline(cin, in4);

    double ai1 = stod(in1);
    double ai2 = stod(in2);
    double ai3 = stod(in3);
    double ai4 = stod(in4);

    double aina[3] = {ai1,ai2,ai3};

    // double out = n1.process(aina,ai4);

    // cout <<"got: "<< out << "\n";
  // };

    cout << "attempts?";
    string attpt;
    getline(cin, attpt);

    int attp = stoi(attpt);

  // for(int i = 0; i < attp; i++){
    // double a[3] = {1,0,0};
    double out = n1.process(aina,ai4,attp);
    // if(i > attp-5 || i < 3){
    //   cout << "got: "<<out<<"\n";
    // };
    cout << "got: "<<out<<"\n";
  // };

  }

}
