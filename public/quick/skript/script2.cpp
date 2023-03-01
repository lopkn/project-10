// #include <iostream>
 #include <stdlib.h>     /* srand, rand */
#include <string>
#include <time.h>
#include <iostream>
int main()
{
  int a;
  srand (time(NULL));

  const std::string stupids[30] = {
  "idiotic ",
  "moronic ","bloody unintelligent ","catastrophicalaly brain dead ",
  "vapid ","pig headed ","cretinous ","naive ","senseless ",
  // "homosexual ",
  "degenerate ","aberrant ","delerious ","apeish ","puerile ","lame and dopey ", "uneducated ",
  "asinine ","unintellectual ","fallacious ","daft ","slow ", "obtuse ",
  "feeble ", "uneducated ","invalid ","inconsequential ","frivolous ","protohominid ","negligable "
};

const std::string adverbs[20]={
  "trivially ","horrendously ","heinously ","erroneously ","notably ","exceptionally ",
  "abnormally ","abhorrently ","atrociously ","direly "," hideously ","dreadfully ","awfully ","harrowingly ",
  "unbelievably ","improbably ","implausibly ","disturbingly ","excrutiatingly ", "catastrophicalaly "
};

  a = rand() % 30;
  int b = rand()%20;
  std::cout << adverbs[b] + stupids[a] + " " << std::endl;
  return 0;
}

