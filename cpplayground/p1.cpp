

#include <iostream>
#include <string>
#include <map>
#include <cmath>
#include <ctime>
#include <chrono>

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

uint64_t timenow() {
  using namespace std::chrono;
  return duration_cast<milliseconds>(system_clock::now().time_since_epoch()).count();
}


class nur{
public:
  double act;
  double xpt;
  int actors;

  nur(*brain)[100];

  bool used = false;
  bool stable = false;
  double adder = 0;

  nur * linkedNur;
  int linkedNurNum = -1;

  double knowns[20][4];
  int knownCounter = 0;

  double multipliers[3] = {0,0,0};

  double process(double inp[3],double expected,uint64_t learntimes,nur(*n)[100]){
    
    used = true;

    brain = n;

    double originalError = evaluateAll(multipliers,adder);


    if(knownCounter < 20){
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


    double fe = learn(learntimes,error,originalError);




    std::cout << "error: "<< fe <<"\n";
    std::cout << "multipliers: "<<multipliers[0]<<", "<<multipliers[1]<<", "<<multipliers[2]<<" + "<<adder<<" |";

    return(question(inp[0],inp[1],inp[2]));
  };

  double evaluate(double inp[3],double multiplier[3],double ad,double expected){
    used = true;
    double out = 0;
    for(int i = 0; i < 3; i++){
      out += inp[i]*multiplier[i];
    };

    out += ad;

    double error = fabs(out-expected);
    return(error);
  };

  double question(double a,double b,double c){
    return(a*multipliers[0]+b*multipliers[1]+c*multipliers[2]+adder);
  }

  double evaluateAll(double multiplier[3], double ad){
    double currentError = 0;
    for(int i = 0; i < knownCounter; i++){
      double a[3] = {knowns[i][0],knowns[i][1],knowns[i][2]};
      currentError += evaluate(a,multiplier,ad,knowns[i][3]);
    };
    return(currentError);
  };

  double learn(uint64_t times, double error, double orig){

    used = true;

    double temp[3] = {multipliers[0],multipliers[1],multipliers[2]};

    double currentError = evaluateAll(temp,adder);


    int changes = 0;

    double beforeError = currentError;
    double BEFOREM[4] = {multipliers[0],multipliers[1],multipliers[2],adder};

    while(times > timenow()){

    int rev = 1;
    if(mrand()>0.5){
      rev = -1;
    };

    double Tmultipliers[3] = {multipliers[0],multipliers[1],multipliers[2]};
    double tadder = adder;
    int R = std::floor(mrand()*4);
    if(R < 3){
      Tmultipliers[R] += rev*mrand()*error*0.25/knownCounter;
    } else {
      tadder += rev*mrand()*error*0.25/knownCounter;
    };

    double newError = evaluateAll(Tmultipliers,tadder);
    if(stable == false){
    if(newError < currentError){
      multipliers[0] = Tmultipliers[0];
      multipliers[1] = Tmultipliers[1];
      multipliers[2] = Tmultipliers[2];
      adder = tadder;
      currentError = newError;
      changes += 1;
      };
    } else {

    };

  };

  if(beforeError-currentError < 0.1 || orig-currentError < -0.5){
    if(currentError > 0.1){
      int nextNurNum = floor(mrand()*100);
      if((*brain)[nextNurNum].used == false){
        (*brain)[nextNurNum].used = true;
        stable = true;
        linkedNur = &(*brain)[nextNurNum];
        linkedNurNum = nextNurNum;
      };
    };
  };


  std::cout<<"\nchanged: "<<changes<<" times\n";

  return(currentError);

  };

};

int main(){

  nur NEURONS[100];

  int currentNur = 0;

  nur (*NEURONPOINTER)[100] = &NEURONS;

  using namespace std;
  while(true){

    cout << "operation? -> ";
    string operation;
    getline(cin, operation);

    if(operation == "l"){

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



      cout << "attempts?";
      string attpt;
      getline(cin, attpt);

      uint64_t attp = stoi(attpt) + timenow();
      cout << timenow() << "-" << attp;
      if(stoi(attpt) > 0){
      double out = NEURONS[currentNur].process(aina,ai4,attp,NEURONPOINTER);

      cout << "got: "<<out<<"\n";
      }

    } else if(operation == "q"){
      cout << "what do you want it to answer? -> \n";
      string in1;
      string in2;
      string in3;
      getline(cin, in1);
      getline(cin, in2);
      getline(cin, in3);
      double ai1 = stod(in1);
      double ai2 = stod(in2);
      double ai3 = stod(in3);

      cout << NEURONS[currentNur].question(ai1,ai2,ai3)<<"\n";
    } else if(operation == "s"){

      string in1;
      getline(cin, in1);
      int ai1 = stoi(in1);

      currentNur = ai1;

    } else if(operation == "p"){
      cout << NEURONS[currentNur].linkedNurNum;
    } else if(operation == "t"){
      time_t T = timenow();
      cout << T;
    };
  };

}
