import sys
import pyautogui

print("Python script started. Waiting for messages...",flush=True)

str = ""

for line in sys.stdin:
    message = line[:-1]  # Read messages from stdin
    print(f'Received message: {message}',flush=True)
    
    if message[0:7]=="[CLICK]":
        pos = message[7:].split(",")
        pyautogui.click(x=int(pos[0]), y=int(pos[1]))
        continue;
    if message[0:6]=="[GPOS]":
        pos = pyautogui.position()
        signature = message[6:]
        print(f'[RES]-{pos.x},{pos.y}',flush=True)
        continue;

    if message == "[FLUSH]":
        if len(str) > 0 and str[-1]=="\n":
            str = str[:-1]

        g = ""
        while len(str)>0:

            if str[0] == "\n":
                pyautogui.write(g,interval=0.001)
                g=""
                pyautogui.keyDown('shift')
                pyautogui.press('enter',interval=0.005)
                pyautogui.keyUp('shift')
            else:
                g += str[0]

            str = str[1:]
        pyautogui.typewrite(g)
        print("S",flush=True)
        print(str,flush=True) # start/end logging
        print("E",flush=True)
        str = ""
        continue;

    str += message + "\n"
    # if message == "":
    #     str += "\n"

    # pyautogui.typewrite(message)