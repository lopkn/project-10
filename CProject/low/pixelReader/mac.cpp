#include <opencv2/opencv.hpp>
#include <iostream>

int main() {
    // Capture the screen using OpenCV
    cv::Mat screen;
    screen = cv::imread("/path/to/screen_capture.png"); // Replace with your screenshot path

    if (screen.empty()) {
        std::cerr << "Failed to capture screen." << std::endl;
        return 1;
    }

    // Coordinates of the pixel to read
    int x = 100;
    int y = 100;

    // Check if coordinates are within image bounds
    if (x < 0 || x >= screen.cols || y < 0 || y >= screen.rows) {
        std::cerr << "Coordinates out of bounds." << std::endl;
        return 1;
    }

    // Get the pixel color
    cv::Vec3b pixel = screen.at<cv::Vec3b>(y, x);
    int blue = pixel[0];
    int green = pixel[1];
    int red = pixel[2];

    // Output the RGB values
    std::cout << "Pixel color at (100, 100): "
              << "R: " << red << ", "
              << "G: " << green << ", "
              << "B: " << blue << std::endl;

    return 0;
}
