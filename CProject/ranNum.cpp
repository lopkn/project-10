 #include <stdlib.h>     /* srand, rand */
#include <string>
#include <time.h>
#include <iostream>
#include <cmath>



std::string dec(){
  using namespace std;
  float a = rand()%10000;
  a = a/(rand()%100);
  string b = to_string(a);
  string c = "0.";

  while(b[b.length()-1] == c[0] || b.length() > 5 || b[b.length()-1] == c[1]){
    b.pop_back();
  }
  return(b);

}

std::string mm(int lev);

std::string concact(){
using namespace std;
  int possibles = 5;
  // string oprs[possibles] = {"log","root",".","^","PI"};
  int randOp = rand()%5;
  if(randOp == 0){
    if(rand()%100 < 30){
      return("log"+to_string(rand()%10+2)+"("+to_string(rand()%100)+")");
    }
    if(rand()%100 < 20){
      return("log"+to_string(rand()%10+2)+"["+mm(13)+"]");
    }
    return("log("+to_string(rand()%100)+")");
  } else if(randOp == 1){
    if(rand()%100 < 10){
      return("root"+to_string(rand()%10+2)+"("+to_string(rand()%100)+")");
    }
    return("root("+to_string(rand()%100)+")");
  } else if(randOp == 2){
    // return(to_string(float(round( ( rand()%10000 ) /3 )*3)));
    return(dec());
  } else if(randOp == 3){

    if(rand()%100 < 10){
      return(concact()+" ^ "+to_string(rand()%10+2));
    }

    if(rand()%100 < 20){
      return( "[ "+ mm(13)+" ] ^ "+to_string(rand()%10+2));
    }

    return(to_string(rand()%999+1)+" ^ "+to_string(rand()%10+2));
  } else {
    return("PI");
  }

}

std::string mm(int lev){
  std::string operas[5] = {"+","-","*","/"};
  using namespace std;
  int a = rand() % 999;

  string OU = to_string(a);
  int i = lev;
  while(rand()%100 < 50 || i > 1){
    i--;
    int opr = rand() % 4;
    int rr = rand() % 999;

    if(rand()%100 < 26){
      OU = OU + " " + operas[opr] + " ans";
      continue;
    }
    if(rand()%100 < 56){
      string cct = concact();
      OU = OU + " " + operas[opr] + " " + cct;
      continue;
    }

    if(rand()%100 < 50){
      OU = OU + " " + operas[opr] + " " + dec();
      continue;
    }

    OU = OU + " " + operas[opr] + " " + to_string(rr+1);
  }
  return(OU);
}


int main()
{
using namespace std;

  // const int operaRanges[5] = {999,999,999,999};

  cout << "open\n";
  srand (time(NULL));
  while(true){

  string x;
  cin >> x;

  string OU = mm(8);

  cout << OU << "\n";

  }
  return 0;
}

