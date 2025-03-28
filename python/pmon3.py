import tkinter as tk
from pynput import keyboard
from sys import platform

# Global variable to keep track of the window
window = None
root = None
ON = False
label = None
logstr = ""
logdstr = ""

textHandlers = {"normal":{"lvl":0,"txt":"","type":"log"},"command":{"lvl":1,"txt":"","type":"normal"}}
currentHandlers = [textHandlers["normal"]]

def runCommand(c):
	global label
	csp = c.split()
	print(csp,c)
	if(csp[0] == "getlog"):
		if(csp[1] in textHandlers):
			print(textHandlers[csp[1]]["txt"])
	if(csp[0] == "color"):
		label.config(fg=csp[1])
	if(csp[0] == "save"):
		jstr = json.dumps(textHandlers)
		print(jstr)

def commandHandler(i,k):
	if(k == "[e]"):
		print("command recieved:",i["txt"])
		runCommand(i["txt"])
		i["txt"] = ""
		constants["commanding"]=False
		currentHandlers.remove(i)
		return("exit")
	textHandle(i,k)

textHandlers["command"]["handler"] = commandHandler


constants = {"commandMode":0,"commanding":False,"displayCounter":0}


def on_press(key):
    global window
    global root
    global ON
    global logstr
    global logdstr
    global constants
    try:
        print(key.char, "was pressed")
        logstr += key.char
        logdstr += key.char
        keyHandler(key.char)
        if key.char == '\\':  # Check if backslash is pressed
            constants["displayCounter"] += 1
            if constants["displayCounter"] > 2:
                constants["displayCounter"] = 0
            
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
                    root.wm_attributes("-alpha",0.5)
                    ON = True
        if key.char == "/":
            constants["commandMode"] += 1
            if constants["commandMode"] > 2:
                constants["commandMode"] = 0
                constants["commanding"]= True
                logstr += "ENTERED COMMAND MODE:"
                currentHandlers.append(textHandlers["command"])


    except AttributeError:
        print(f'Special key pressed: {key}')
        if key == keyboard.Key.space:
            logstr += " "
            keyHandler(" ")
            logdstr += " "
        elif key == keyboard.Key.backspace:
            logstr += "[b]"
            keyHandler("[b]")
            logdstr = logdstr[:-1]
        elif key == keyboard.Key.enter:
            logstr += "[e]"
            keyHandler("[e]")
            logdstr += "\n"
        pass  # Handle special keys here is\ thomas is a homosexual why is he so homosexual? he looks at leo and his homosexuality inspires 
    labelUpdate()

def keyHandler(k):
	for i in currentHandlers:
		if not "handler" in i:
			textHandle(i,k)
		else:
			i["handler"](i,k)
	pass

def textHandle(handle,k):
	if(handle["type"] == "log"):
		handle["txt"] += k
	if(handle["type"] == "normal"):
		if(len(k) == 1):
			handle["txt"] += k
		elif k == "[b]":
			handle["txt"] = handle["txt"][:-1]
		elif k == "[e]":
			handle["txt"] += "\n"

def open_window():
    global window
    global root
    global label



    if platform == "linux" or platform == "linux2":
        root.overrideredirect(True)
        root.wait_visibility(root)
        # root.wm_attributes("-alpha", 0.5)
    elif platform == "darwin":
        root.overrideredirect(True)
        # Make the root window always on top
        root.wm_attributes("-topmost", True)
        # Turn off the window shadow
        root.wm_attributes("-transparent", True)
        # Set the root window background color to a transparent color
        root.config(bg='systemTransparent')
        root.geometry("+0+0")
        # Store the PhotoImage to prevent early garbage collection
        # root.image = tk.PhotoImage(file="test.png")
        # Display the image on a label
        # label = tk.Label(root, image=root.image)

        label = tk.Label(root,text="===== overlay initialized =====",fg="#00FF00",font=(60),bg="systemTransparent",wraplength=root.winfo_screenwidth(),anchor="w")
        # Set the label background color to a transparent color
        label.pack()
    elif platform == "win32":
        root.image = tk.PhotoImage(file='test.png')
        label = tk.Label(root, image=root.image, bg='white')
        root.overrideredirect(True)
        root.geometry("+250+250")
        root.lift()
        root.wm_attributes("-topmost", True)
        root.wm_attributes("-disabled", True)
        root.wm_attributes("-transparentcolor", "white")
        label.pack()

    # window = 1
    # window = tk.Toplevel(root)  # Create a new top-level window
    # window.title("Key Press Detected")
    # label = tk.Label(window, text="Backslash key pressed!", padx=20, pady=20)
    # label.pack()
    # window.protocol("WM_DELETE_WINDOW", hide_window)  # Handle window close

    root.config(takefocus = 0)





def labelUpdate():
    global label
    global logstr
    global logdstr
    dispstr = logstr.replace("[e]","\n")
    label.config(text=logstr)
    label.config(anchor="w")
    label.config(justify=tk.LEFT)






def hide_window():
    global window
    if window is not None:
        window.withdraw()  # Hide the window

# Create the root window but keep it hidden
root = tk.Tk()
# root.withdraw()  # Hide the root window

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










