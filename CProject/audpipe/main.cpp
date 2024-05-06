#include <portaudio.h>
#include <cmath>
#include <cstdio>

// Constants
const double SAMPLE_RATE = 44100.0;
const double AMPLITUDE = 0.5;
const double FREQUENCY = 440.0;

// Callback function for audio stream
int audioCallback(const void* inputBuffer, void* outputBuffer,
                  unsigned long framesPerBuffer,
                  const PaStreamCallbackTimeInfo* timeInfo,
                  PaStreamCallbackFlags statusFlags,
                  void* userData)
{
    float* out = static_cast<float*>(outputBuffer);
    for (unsigned int i = 0; i < framesPerBuffer; ++i) {
        double sample = AMPLITUDE * std::sin(2.0 * M_PI * FREQUENCY * (i / SAMPLE_RATE));
        *out++ = static_cast<float>(sample);
    }
    return paContinue;
}

int main()
{
    Pa_Initialize();

    // Open microphone input stream
    PaStream* inputStream;
    Pa_OpenDefaultStream(&inputStream, 1, 0, paFloat32, SAMPLE_RATE, 256, nullptr, nullptr);

    // Open output stream
    PaStream* outputStream;
    Pa_OpenDefaultStream(&outputStream, 0, 1, paFloat32, SAMPLE_RATE, 256, audioCallback, nullptr);

    // Start streams
    Pa_StartStream(inputStream);
    Pa_StartStream(outputStream);

    // Wait for a key press to stop
    getchar();

    // Stop and close streams
    Pa_StopStream(inputStream);
    Pa_CloseStream(inputStream);
    Pa_StopStream(outputStream);
    Pa_CloseStream(outputStream);

    Pa_Terminate();

    return 0;
}