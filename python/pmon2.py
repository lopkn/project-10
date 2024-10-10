# import tkinter as tk
# from pynput import keyboard

# # Global variable to keep track of the window
# window = None
# root = None
# ON = False

# def on_press(key):
#     global window
#     global root
#     global ON
#     try:
#         print(key.char, " was pressed")
#         if key.char == '\\':  # Check if backslash is pressed
#             if ON and window is not None:
#                 root.withdraw()
#                 window.withdraw()
#                 ON = False
#                 print("CLOSE")
#             elif not ON:
#                 if window is None:  # Create the window if it doesn't exist
#                     open_window()
#                     ON = True
#                 else:  # Show the window if it's hidden
#                     window.deiconify()
#                     ON = True

#     except AttributeError:
#         pass  # Handle special keys

# def open_window():
#     global window
#     window = tk.Toplevel(root)  # Create a new top-level window
#     window.title("Key Press Detected")
#     label = tk.Label(window, text="Backslash key pressed!", padx=20, pady=20)
#     label.pack()
#     window.protocol("WM_DELETE_WINDOW", hide_window)  # Handle window close

# def hide_window():
#     global window
#     if window is not None:
#         window.withdraw()  # Hide the window

# # Create the root window but keep it hidden
# root = tk.Tk()
# root.withdraw()  # Hide the root window

# # Set up the listener
# listener = keyboard.Listener(on_press=on_press)
# listener.start()

# # Run the tkinter main loop
# try:
#     tk.mainloop()
# except KeyboardInterrupt:
#     if window is not None:
#         window.destroy()  # Clean up the window if it exists
#     listener.stop()  # Stop the listener thread


import tkinter as tk
from pynput import keyboard
from sys import platform
import objc

# Global variable to keep track of the window
window = None
root = None
ON = False
label = None
logstr = ""

def on_press(key):
    global window
    global root
    global logstr
    global ON
    try:
        print(key.char, " was pressed")
        logstr+= key.char
        labelUpdate()
        if key.char == '\\':  # Check if backslash is pressed
            if ON:
                root.withdraw()
                # window.withdraw()
                ON = False
                print("CLOSE")
            elif not ON:
                # if window is None:  # Create the window if it doesn't exist
                    # open_window()
                    # ON = True
                # else:  # Show the window if it's hidden
                root.deiconify()
                root.wm_attributes("-topmost",True)
                ON = True

    except AttributeError:
        pass  # Handle special keys


def make_click_through(win):
    """Make the window click-through on macOS."""
    win.update_idletasks()
    win_id = win.winfo_id()

    # Use pyobjc to set the window to be transparent and allow clicks to pass through
    NSApp = objc.loadBundle('AppKit', globals(), objc.pathForFramework('/System/Library/Frameworks/AppKit.framework'))
    NSWindow = NSApp.NSWindow
    win_obj = NSWindow.alloc().initWithContentRect_styleMask_backing_defer_(
        (0, 0, 100, 100),  # Size of the window
        0,  # No window style
        2,  # Buffered
        False
    )
    win_obj.setOpaque_(False)
    win_obj.setAlphaValue_(0.5)  # Set transparency
    win_obj.setIgnoresMouseEvents_(True)  # Allow clicks to pass through
    win_obj.setLevel_(NSApp.NSStatusWindowLevel)  # Set window level

def open_window():
    global window
    global root
    global label


    if platform == "linux" or platform == "linux2":
        root.overrideredirect(True)
        root.wait_visibility(root)
        root.wm_attributes("-alpha", 0.5)
    elif platform == "darwin":
        root.overrideredirect(True)
        root.wm_attributes("-topmost", True)
        root.wm_attributes("-transparent", True)
        # Set the root window background color to a transparent color
        root.config(bg='systemTransparent')
        root.geometry("+300+300")
        # Store the PhotoImage to prevent early garbage collection
        # root.image = tk.PhotoImage(file="test.png")
        # Display the image on a label
        # label = tk.Label(root, image=root.image)
        label = tk.Label(root,text="HI this is an overlay",fg="white",font=(60),bg="red")
        # Set the label background color to a transparent color
        label.config(bg='systemTransparent')
        label.pack()
    elif platform == "win32":
        root.image = tk.PhotoImage(file='test.png')
        label = tk.Label(root, image=root.image, bg='white')
        root.overrideredirect(True)
        root.geometry("+250+250")
        root.lift()
        root.wm_attributes("-most", True)
        root.wm_attributes("-disabled", True)
        root.wm_attributes("-transparentcolor", "white")
        label.pack()

    # window = 1
    # window = tk.Toplevel(root)  # Create a new top-level window
    # window.title("Key Press Detected")
    # label = tk.Label(window, text="Backslash key pressed!", padx=20, pady=20)
    # label.pack()
    # window.protocol("WM_DELETE_WINDOW", hide_window)  # Handle window close
    make_click_through(root)

def hide_window():
    global window
    if window is not None:
        window.withdraw()  # Hide the window









# Create the root window but keep it hidden
root = tk.Tk()
root.withdraw()  # Hide the root window

open_window()

# Set up the listener
listener = keyboard.Listener(on_press=on_press)
listener.start()

# Run the tkinter main loop
try:
    tk.mainloop()
except KeyboardInterrupt:
    if window is not None:
        window.destroy()  # Clean up the window if it exists
    listener.stop()  # Stop the listener thread

