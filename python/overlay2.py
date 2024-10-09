
from tkinter import *      
root=Tk()  

root.title("overlay")   

x="20"     
y="0" 

def ignore_event(event):
        return "break"

def mouse_event(event):
	print(1)
	return "break"

root.geometry(f'750x50+{x}+{y}') 

# to remove the titlebar     
root.overrideredirect(True) 

# to make the window transparent       
root.attributes("-transparent",True) 
root.bind("<Button-1>", mouse_event)  # Ignore mouse clicks
root.bind("<Key>", ignore_event)  # Ignore key presses
root.bind("<Motion>", ignore_event)


# set bg to red in order to make it transparent     
root.config(bg="#000000")               

l=Label(root,text="HI this is an overlay",fg="white",font=(60),bg="red")     
l.pack() 

# b=Button(root,text="click me to print something",command=lambda:print("this is something"))   
# b.pack()      


# make window to be always on top
root.wm_attributes("-topmost", 1)          
root.geometry('+0+0') 
root.mainloop()



# from sys import platform
# import tkinter as tk
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

# root.mainloop()