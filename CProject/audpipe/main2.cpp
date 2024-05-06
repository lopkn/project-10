#include <iostream>
#include <cmath>
#include <alsa/asoundlib.h>
#include <climits>  // 
#include <iostream>
#include <cmath>
#include <alsa/asoundlib.h>

// Define the desired audio parameters
const unsigned int SAMPLE_RATE = 44100;  // Sample rate in Hz
const unsigned int DURATION = 5;         // Duration in seconds
const unsigned int CHUNK_SIZE = 1024;    // Number of frames to write at a time

int main() {
    // Open the default PCM device for recording
    snd_pcm_t *handle;
    int err = snd_pcm_open(&handle, "hw:2,2", SND_PCM_STREAM_CAPTURE, 0);
    if (err < 0) {
        std::cerr << "Couldn't open PCM device: " << snd_strerror(err) << std::endl;
        return 1;
    }

    // Set the desired parameters for the PCM stream
    snd_pcm_set_params(handle,
                       SND_PCM_FORMAT_S16_LE,      // Sample format (16-bit, little-endian)
                       SND_PCM_ACCESS_RW_INTERLEAVED,
                       1,                          // Mono channel count
                       SAMPLE_RATE,
                       0,                          // Allow resampling
                       500);                    // 0.5 seconds latency

    // Generate the sine wave
    const double frequency = 440.0;  // Frequency of the sine wave in Hz
    const double amplitude = 0.5;    // Amplitude of the sine wave (0.0 to 1.0)
    const unsigned int numSamples = SAMPLE_RATE * DURATION;
    const double increment = 2.0 * M_PI * frequency / SAMPLE_RATE;

    short *buffer = new short[CHUNK_SIZE];
    unsigned int framesWritten = 0;
    while (framesWritten < numSamples) {
        const unsigned int framesToWrite = std::min(CHUNK_SIZE, numSamples - framesWritten);
        for (unsigned int i = 0; i < framesToWrite; ++i) {
            buffer[i] = static_cast<short>(amplitude * SHRT_MAX * sin((i + framesWritten) * increment));
        }

        // Write the audio data to the PCM device for recording
        int written = snd_pcm_writei(handle, buffer, framesToWrite);
        if (written < 0) {
            std::cerr << "Write to PCM device failed: " << snd_strerror(written) << std::endl;
            delete[] buffer;
            return 1;
        }

        framesWritten += written;
    }

    // Clean up
    delete[] buffer;
    snd_pcm_close(handle);

    return 0;
}