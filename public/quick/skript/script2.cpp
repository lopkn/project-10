// #include <iostream>
 #include <stdlib.h>     /* srand, rand */
#include <string>
#include <time.h>
#include <iostream>
int main()
{
  int a;
  srand (time(NULL));

  const std::string stupids[23] = {
  "unbelievably idiotic ",
  "moronic ","bloody unintelligent ","catastrophicalaly brain dead ",
  "vapid ","pig headed ","cretinous ","naive ","senseless ","trivially homosexual ",
  "degenerate ","aberrant ","delerious ","apeish ","puerile ","lame and dopey ", "uneducated ",
  "asinine ","unintellectual ","fallacious ","daft ","slow ", "obtuse"
};

  a = rand() % 23;
  std::cout << stupids[a] << std::endl;
  return 0;
}

//g++ script2.cpp && ./a.out



