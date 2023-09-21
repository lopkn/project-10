// #include <iostream>
 #include <stdlib.h>     /* srand, rand */
#include <string>
#include <time.h>
#include <iostream>
int main()
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

  for(int i = 0; i < 20; i++){
  a = rand() % 31;
  int b = rand()%22;
  std::cout << adverbs[b] + stupids[a] + " " << std::endl;
  }
  return 0;
}

