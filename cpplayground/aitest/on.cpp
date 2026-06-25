#include <iostream>
#include <vector>
#include <numeric>
#include <onnxruntime_cxx_api.h>

#include <cmath>
#include <stdexcept>


#include "httplib.h"

#include <fstream>

#include <X11/Xlib.h>
#include <X11/Xutil.h>
#include <X11/extensions/XShm.h>
#include <sys/ipc.h>
#include <sys/shm.h>




#include <cstdint>



void sendFloatVector(const std::vector<float>& data) {
    // 1. Initialize the client targeting your JS endpoint
    // Tip: Reuse this client instance globally if calling the function frequently
    httplib::Client cli("http://localhost:3000");

    // 2. Cast the raw vector memory pointer to a byte pointer
    const char* rawBytes = reinterpret_cast<const char*>(data.data());

    // 3. Calculate total payload size (number of floats * 4 bytes each)
    size_t byteLength = data.size() * sizeof(float);

    // 4. Send the binary stream via POST
    auto res = cli.Post("/stream-data", rawBytes, byteLength, "application/octet-stream");

    // 5. Error handling
    if (!res) {
        std::cerr << "Connection error: Could not reach JS server." << std::endl;
    } else if (res->status != 200) {
        std::cerr << "Server returned error code: " << res->status << std::endl;
    }
}


// const int vsize = 224;
// const int outsize = 1024;
// const char* model_path = "../../../AI/mobilenetv3_headless.onnx";

const int vsize = 518;
const int outsize = 384;
const char* model_path = "../../../AI/dinov2_headless.onnx";


void saveImg(const std::string& filename, const uint8_t* bgra_pixels, int width = vsize, int height = vsize) {
    std::ofstream out(filename, std::ios::binary);
    if (!out) {
        std::cerr << "Error: Could not open " << filename << " for writing!" << std::endl;
        return;
    }

    // 1. Write the 3-line PPM Bitmap Header
    // P6 = Raw RGB bytes, 224 224 = dimensions, 255 = max color value
    out << "P6\n" << width << " " << height << "\n255\n";

    // 2. Loop through the pixels and write them out as RGB
    int total_pixels = width * height;
    for (int i = 0; i < total_pixels; ++i) {
        int src_index = i * 4; // 4 channels per pixel (B, G, R, A)

        // Read the interleaved bytes
        uint8_t b = bgra_pixels[src_index + 0];
        uint8_t g = bgra_pixels[src_index + 1];
        uint8_t r = bgra_pixels[src_index + 2];
        // (src_index + 3 is Alpha, which we completely ignore)

        // Write them in the exact order the PPM format expects: R, G, B
        out.put(r);
        out.put(g);
        out.put(b);
    }
}


float euclidean_distance(const std::vector<float>& v1, const std::vector<float>& v2) {
    // 1. Safety Check
    if (v1.size() != v2.size()) {
        throw std::invalid_argument("Vectors must be of equal length.");
    }
    
    // 2. Compute sum of squared differences
    float sum = std::inner_product(
        v1.begin(), v1.end(), v2.begin(), 0.0f,
        std::plus<float>(),
        [](float a, float b) { return (a - b) * (a - b); }
    );
    
    // 3. Return square root
    return std::sqrt(sum);
}

// Preprocesses a raw screen capture patch into the planar, normalized format ONNX expects
void ProcessImageToTensor(const uint8_t* raw_screen_pixels, 
                          int width, int height, int num_channels,
                          std::vector<float>& out_input_data) {
    
    int total_pixels = width * height;
    
    // Ensure our output vector is perfectly sized: 1 * 3 * width * height
    out_input_data.resize(3 * total_pixels);

    // Offsets telling us exactly where the R, G, and B planes start in our output array
    int r_offset = 0;
    int g_offset = total_pixels;
    int b_offset = total_pixels * 2;

    for (int i = 0; i < total_pixels; ++i) {
        // 1. Calculate where we are in the raw interleaved screen buffer
        int src_index = i * num_channels; 

        // 2. Extract raw bytes (Handling BGRA vs RGB depending on your screen grabber)
        // Most OS screen capture APIs (like Windows DXGI / X11) default to BGRA layout:
        uint8_t b = raw_screen_pixels[src_index + 0];
        uint8_t g = raw_screen_pixels[src_index + 1];
        uint8_t r = raw_screen_pixels[src_index + 2];
        // (Index 3 would be Alpha/Transparency, which we ignore)

        // 3. Normalize to [0.0, 1.0] and pack them planarly into their designated zones
        out_input_data[r_offset + i] = r / 255.0f;
        out_input_data[g_offset + i] = g / 255.0f;
        out_input_data[b_offset + i] = b / 255.0f;
    }
}


class X11ScreenGrabber {
private:
    Display* display;
    Window root;
    XShmSegmentInfo shminfo;
    XImage* ximage;
    bool shm_attached = false;

    const int width = vsize;
    const int height = vsize;

public:
    X11ScreenGrabber() {
        display = XOpenDisplay(nullptr);
        if (!display) {
            throw std::runtime_error("Cannot open X11 Display!");
        }
        root = DefaultRootWindow(display);

        // 1. Check for MIT-SHM extension availability
        if (!XShmQueryExtension(display)) {
            XCloseDisplay(display);
            throw std::runtime_error("X11 Shared Memory Extension (MIT-SHM) not supported!");
        }

        // 2. Allocate the XImage wrapper structure for a 224x224 patch
        // 24-bit depth matches standard modern desktop environments
        ximage = XShmCreateImage(display, DefaultVisual(display, 0), 24, ZPixmap, nullptr, &shminfo, width, height);
        if (!ximage) {
            XCloseDisplay(display);
            throw std::runtime_error("Failed to allocate XShmImage structure!");
        }

        // 3. Create a shared memory segment in Linux kernel RAM
        shminfo.shmid = shmget(IPC_PRIVATE, ximage->bytes_per_line * ximage->height, IPC_CREAT | 0777);
        if (shminfo.shmid == -1) {
            XDestroyImage(ximage);
            XCloseDisplay(display);
            throw std::runtime_error("System shared memory allocation failed!");
        }

        // 4. Attach the memory segment to our C++ program pointer address space
        shminfo.shmaddr = (char*)shmat(shminfo.shmid, nullptr, 0);
        ximage->data = shminfo.shmaddr;
        shminfo.readOnly = False;

        // 5. Tell the X Server to attach to this same memory block
        if (!XShmAttach(display, &shminfo)) {
            shmdt(shminfo.shmaddr);
            shmctl(shminfo.shmid, IPC_RMID, nullptr);
            XDestroyImage(ximage);
            XCloseDisplay(display);
            throw std::runtime_error("X Server failed to attach to Shared Memory segment!");
        }
        shm_attached = true;
    }

    ~X11ScreenGrabber() {
        if (shm_attached) {
            XShmDetach(display, &shminfo);
            shmdt(shminfo.shmaddr);
            shmctl(shminfo.shmid, IPC_RMID, nullptr);
        }
        if (ximage) XDestroyImage(ximage);
        if (display) XCloseDisplay(display);
    }

    // Returns a raw pointer to the updated 224x224 BGRA byte array inside Shared Memory
    const uint8_t* GrabPatchAroundCursor() {
        // Query current mouse cursor coordinates
        Window root_return, child_return;
        int root_x, root_y, win_x, win_y;
        unsigned int mask_return;
        
        XQueryPointer(display, root, &root_return, &child_return, &root_x, &root_y, &win_x, &win_y, &mask_return);

        // Center the 224x224 bounding box onto the crosshair pointer position
        int src_x = root_x - (width / 2);
        int src_y = root_y - (height / 2);

        // Guard boundaries to make sure coordinates stay entirely inside screen boundaries
        if (src_x < 0) src_x = 0;
        if (src_y < 0) src_y = 0;

        // Pull the cropped region from the desktop directly into our preallocated shared RAM buffer
        // 'AllPlanes' targets all bitplanes (full color spectrum)
        XShmGetImage(display, root, ximage, src_x, src_y, AllPlanes);

        return reinterpret_cast<const uint8_t*>(ximage->data);
    }
};





void SaveVectorBinary(const std::string& filename, const std::vector<float>& vec) {
    std::ofstream out(filename, std::ios::binary);
    if (!out) throw std::runtime_error("Cannot open file for writing!");
    
    // Write the raw memory buffer directly to disk
    out.write(reinterpret_cast<const char*>(vec.data()), vec.size() * sizeof(float));
}


std::vector<float> LoadVectorBinary(const std::string& filename, size_t expected_size = outsize) {
    std::ifstream in(filename, std::ios::binary);
    if (!in) throw std::runtime_error("Cannot open file for reading!");

    std::vector<float> vec(expected_size);
    in.read(reinterpret_cast<char*>(vec.data()), expected_size * sizeof(float));
    return vec;
}

int main(int argc, char* argv[]) {
    try {
        // 1. Initialize the ONNX Runtime Environment
        // This sets up the internal thread pools and logging systems. Keep this alive globally!
        Ort::Env env(ORT_LOGGING_LEVEL_WARNING, "AimAssistEngine");

        // 2. Configure Session Options
        Ort::SessionOptions session_options;
        session_options.SetIntraOpNumThreads(1); // Keep it light (1 core) so it doesn't fight your game
        session_options.SetGraphOptimizationLevel(GraphOptimizationLevel::ORT_ENABLE_EXTENDED);




        // 3. Create the Inference Session (Loads the model file)
         
        Ort::Session session(env, model_path, session_options);


        //         // Add this temporary snippet right after creating the Ort::Session
        // Ort::AllocatorWithDefaultOptions allocator;
        // std::cout << "--- ALL OPERATIONAL OUTPUT NAMES AVAILABLE ---" << std::endl;
        // for (size_t i = 0; i < session.GetOutputCount(); i++) {
        //     std::string real_name = session.GetOutputNameAllocated(i, allocator).get();
        //     std::cout << "Available Output Index " << i << " -> \"" << real_name << "\"" << std::endl;
        // }





        // 4. Define your Input Properties (Match your model's expected layout)
        // Let's assume a 1D vector of 512 floats (like an image feature fingerprint)

        int batch_size = 1;
        int channels = 3;
        int width = vsize;
        int height = vsize;

        std::vector<int64_t> input_shape = {batch_size, channels, width, height}; 
        

        size_t total_elements = batch_size * channels * height * width;
        std::vector<float> input_data(total_elements, 0.5f); // fills with all 0.5

        // Populate your live data vector
        // std::iota(input_data.begin(), input_data.end(), 0.1f); // Fills with dummy floats: 0.1, 1.1, 2.1...

        X11ScreenGrabber grabber;
        const uint8_t* raw_bgra_pixels = grabber.GrabPatchAroundCursor();

        if(argc > 1){
            saveImg("debug_frame.ppm", raw_bgra_pixels, vsize, vsize);
        };

        // 2. Re-arrange from BGRA Interleaved to RGB Planar + Normalize to [0,1]
        // Note: 4 channels because X11 pads 24-bit screen buffers out to 32-bit (BGRA) bytes.
        ProcessImageToTensor(raw_bgra_pixels, vsize, vsize, 4, input_data);







        // 5. Create the Input Tensor (ZERO COPY SHUTTLE)
        // Passing 'input_data.data()' binds the tensor DIRECTLY to your raw CPU memory address.
        Ort::MemoryInfo memory_info = Ort::MemoryInfo::CreateCpu(OrtArenaAllocator, OrtMemTypeDefault);
        Ort::Value input_tensor = Ort::Value::CreateTensor<float>(
            memory_info, 
            input_data.data(), input_data.size(), 
            input_shape.data(), input_shape.size()
        );

        // 6. Set Node Names (Match the input/output labels defined inside the .onnx file)
        const char* input_names[] = {"image_tensor"};
        const char* output_names[] = {"raw_features"};

        // 7. Run Inference (Executes the math pass)
        // This is synchronous and lightning-fast (<1ms for tiny models)
        auto output_tensors = session.Run(
            Ort::RunOptions{nullptr}, 
            input_names, &input_tensor, 1, // Pass inputs
            output_names, 1               // Request outputs
        );

        // 8. Extract the Result Array
        float* output_array = output_tensors[0].GetTensorMutableData<float>();
        
        // Print the first value returned by the model


        std::vector<float> lastVector = LoadVectorBinary("tmp");
        std::vector<float> outputVector(output_array, output_array + outsize);

        if(argc > 1){
            SaveVectorBinary("tmp",outputVector);
            // std::cout << "saved" << argc << std::endl;
        } else {
            // std::cout << "nosave" << std::endl;
        }



        // std::cout << "Model evaluated successfully! First output element: " << outputVector.front() << std::endl;
        // std::cout << "saved element from last time: " << lastVector.front() << std::endl;

        std::cout << "DISTANCE: " << euclidean_distance(outputVector,lastVector) << std::endl;

        sendFloatVector(outputVector);


    } catch (const Ort::Exception& e) {
        std::cerr << "ONNX Runtime exception hit: " << e.what() << std::endl;
        return 1;
    }

    return 0;
}
