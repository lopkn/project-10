#include <ApplicationServices/ApplicationServices.h>
#include <unistd.h> // For usleep

void simulateKeyPress(CGKeyCode key) {
    // Key down event
    CGEventRef keyDownEvent = CGEventCreateKeyboardEvent(NULL, key, true);
    CGEventPost(kCGHIDEventTap, keyDownEvent);
    CFRelease(keyDownEvent);

    // Sleep for a brief moment
    usleep(1000); // 100 milliseconds

    // Key up event
    CGEventRef keyUpEvent = CGEventCreateKeyboardEvent(NULL, key, false);
    CGEventPost(kCGHIDEventTap, keyUpEvent);
    CFRelease(keyUpEvent);
}
int main() {
    // Simulate pressing the "A" key (key code 0)
    int i = 0;
    simulateKeyPress(0); // 0 is the key code for 'A'
    while(i < 60){
        i+= 1;
        simulateKeyPress(i);
    }
    return 0;
}