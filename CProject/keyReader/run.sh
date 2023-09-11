# g++ -c test2.cpp $(pkg-config --libs --cflags cairo) -lX11&&g++ test2.o -o sfml-app -lsfml-graphics -lsfml-window -lsfml-system -lX11 -L/usr/X11R6/lib -lXfixes $(pkg-config --libs --cflags cairo) && sudo ./sfml-app
g++ -c test.cpp $(pkg-config --libs --cflags cairo) -lX11&&g++ test.o -o sfml-app -lsfml-graphics -lsfml-window -lsfml-system -lX11 -lXfixes $(pkg-config --libs --cflags cairo) && sudo ./sfml-app

# g++ -c test5.cpp $(pkg-config --libs --cflags cairo) -lX11&&g++ test5.o -o sfml-app -lsfml-graphics -lsfml-window -lsfml-system -lX11 -lXcomposite -lXfixes $(pkg-config --libs --cflags cairo) && sudo ./sfml-app
# found https://stackoverflow.com/questions/21780789/x11-draw-on-overlay-window