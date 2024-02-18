import time

MIP = 0
gameloop = True

masterSleepTime = 1.5
gameTime = 0

p = {"money":0,"inventory":{}}

def sleep(x):
    global gameTime
    time.sleep(x)
    gameTime = gameTime + x


def printl(st, x=17):
    st = str(st)
    for i in range(0, len(st), x):
        sstr = st[i:i+x]
        print(sstr)

def mainLoop():
    MIP = input()
    if MIP == "1":
        printl("mining...")
        sleep(masterSleepTime)
        printl("mining..")
        sleep(masterSleepTime)
        printl("mining.")
        sleep(masterSleepTime)
        printl("complete")
        printl(p["money"])
        printl(gameTime)
    
while gameloop:
    mainLoop()