g++ -std=gnu++17 on.cpp -o aim_engine  -lpthread   -I./lib_ort/onnxruntime-linux-x64-1.18.0/include     -L./lib_ort/onnxruntime-linux-x64-1.18.0/lib   -lcpp-httplib  -lonnxruntime -lX11 -lXext -Wl,-rpath,'$ORIGIN/lib_ort/onnxruntime-linux-x64-1.18.0/lib' 

LD_LIBRARY_PATH=./lib_ort/onnxruntime-linux-x64-1.18.0/lib ./aim_engine
