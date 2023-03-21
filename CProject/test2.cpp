#include <iostream>
#include <SFML/Graphics.hpp>
#include <time.h>
using namespace sf;

int spacex = 1700;
int spacey = 1000;
class player{
  public:
    double x = 1000;
    double y = 100;
    double velx = 0;
    double vely = 0;
   Sprite s;

    player(Texture t){
      Sprite ss(t);
      ss.setTextureRect(IntRect(0,0,50,50));
      this->s = ss;

    }
  
    void update(int movenum){
      if(movenum == 0){
        vely += 0.0005;
      } else if(movenum == 1){
        vely -= 0.0005;
      } else if(movenum == 2){
        velx -= 0.0005;
      } else if(movenum == 3){
        velx += 0.0005;
      }
    }
    void move(){


      vely += 0.0001;

      if(x > spacex + 105 || x < 0){
        velx *= -1;
      }
      if(y > spacey - 25|| y < 0){
        vely *= -1;
      }
      velx /= 1.0001;
      vely /= 1.0001;
      x += velx;
      y += vely;
    }
};


int main(){

  RenderWindow window(VideoMode(spacex,spacey), "test");

  Texture t;
  t.loadFromFile("pax.png");

  // Sprite s(t);
  // s.setTextureRect(IntRect(0,0,50,50));

  player p(t);
  

  while (window.isOpen()){
  Event e;
  while (window.pollEvent(e)){
    if (e.type == Event::Closed){
      window.close();
    }
}
        if(Keyboard::isKeyPressed(Keyboard::Down)){
          p.update(0);
        } if(Keyboard::isKeyPressed(Keyboard::Up)){
          p.update(1);
        } if(Keyboard::isKeyPressed(Keyboard::Left)){
          p.update(2);
        } if(Keyboard::isKeyPressed(Keyboard::Right)){
          p.update(3);
        }
      
    
    
    


  p.move();
  // s.setPosition(Vector2f(p.x,p.y));
  window.clear(Color::White);
  // window.draw(s);
  window.draw(p.s);
  window.display();



  }
  return 0;

}
