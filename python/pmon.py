from pynput import keyboard, mouse
import mss
import numpy as np
import time
from sys import platform
import tkinter as tk
# import threading

# root = tk.Tk()

# if platform == "linux" or platform == "linux2":
#     root.overrideredirect(True)
#     root.wait_visibility(root)
#     root.wm_attributes("-alpha", 0.5)
# elif platform == "darwin":
#     root.overrideredirect(True)
#     # Make the root window always on top
#     root.wm_attributes("-topmost", True)
#     # Turn off the window shadow
#     root.wm_attributes("-transparent", True)
#     # Set the root window background color to a transparent color
#     root.config(bg='systemTransparent')
#     root.geometry("+300+300")
#     # Store the PhotoImage to prevent early garbage collection
#     root.image = tk.PhotoImage(file="test.png")
#     # Display the image on a label
#     label = tk.Label(root, image=root.image)
#     # Set the label background color to a transparent color
#     label.config(bg='systemTransparent')
#     label.pack()
# elif platform == "win32":
#     root.image = tk.PhotoImage(file='test.png')
#     label = tk.Label(root, image=root.image, bg='white')
#     root.overrideredirect(True)
#     root.geometry("+250+250")
#     root.lift()
#     root.wm_attributes("-topmost", True)
#     root.wm_attributes("-disabled", True)
#     root.wm_attributes("-transparentcolor", "white")
#     label.pack()



# def ignore_event(event):
#         return "break"

# def mouse_event(event):
#     print(1)
#     root.withdraw()
#     return "break"

# root.bind("<Button-1>", mouse_event)  # Ignore mouse clicks
# root.bind("<Key>", ignore_event)  # Ignore key presses
# root.bind("<Motion>", ignore_event)

# l=tk.Label(root,text="HI this is an overlay",fg="white",font=(60),bg="red")     
# l.pack() 



# root.mainloop()


############################













monitor = {"left": 100, "top": 100, "width": 1, "height": 1}





file = open("log.txt",'a')

def now():
    return time.time()*1000

def log(str):
    file.write(str+"\n")

log("==== STARTING NEW LOG AT "+ str(now()))





def grabpix(x,y):
    with mss.mss() as sct:
        monitor["left"] = x; monitor["top"] = y;
        img = sct.grab(monitor)
        pixel_color = np.array(img)[:1, :1, :3][0][0]  # Get RGB values
        # print(f"The color at ({x}, {y}) is: {tuple(pixel_color)}\n")
        return(pixel_color)




overlayer = 0
started = 0;

def on_press(key):
    try:
        print(f'Key pressed: {key.char}')
        global started
        if(key.char == "/"):
            global overlayer
            overlayer += 1
            print(overlayer)
            if(overlayer == 3):
                overlayer = 0
                root.deiconify()
        if(key.char == "[" and started==0):
            # start()
            started = 1
    except AttributeError:
        print(f'Special key pressed: {key}')

# Function to handle mouse clicks
def on_click(x, y, button, pressed):
    if pressed:
        print(f'Mouse clicked at ({x}, {y})')
        grabpix(x,y)

# Setting up the key listener
key_listener = keyboard.Listener(on_press=on_press)
key_listener.start()
print(3)

# Setting up the mouse listener
mouse_listener = mouse.Listener(on_click=on_click)
print(4)
mouse_listener.start()
print(5)
time.sleep(0.5)

# Keep the program running
# root.mainloop()

file.write("TESTING\n")



try:
    while 1:
        if(started):
            log("@>"+str(np.floor(time.time()*1000)) +">"+ str(grabpix(monitor["left"],monitor["top"])[2]==255))
        time.sleep(0.1)
except KeyboardInterrupt:
    file.close()
    print("gracefully closed")

time.sleep(0.5)
print(1)
try:
    key_listener.join()
except:
    print("failed to init key logger")
try:
    mouse_listener.join()
except:
    print("failed to init mouse logger")
print(3)





