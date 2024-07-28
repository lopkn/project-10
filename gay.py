import pygame
import time
from math import sqrt
import numpy as np
seed = 123456789
pygame.init()

inverseFs = 1/0xFFFFFFFF
def random(*args: int) -> float:

    result = seed
    for arg in args:
        result ^= arg * 0x45d9f3b

    result = (result * 0xcc9e2d51) & 0xFFFFFFFF
    result = (((result << 15) | (result >> 17)) * 0x1b873593) & 0xFFFFFFFF
    result = (((result << 13) | (result >> 19)) * 5 + 0xe6546b64) & 0xFFFFFFFF
    
    # Perform the XOR-shift operations
    result ^= (result << 13) & 0xFFFFFFFF
    result ^= (result >> 17) & 0xFFFFFFFF
    result ^= (result << 5) & 0xFFFFFFFF
    
    # Normalize to the range [0, 1]
    return result * inverseFs



width = 50
height = 50
pixelsPerSquare = 15
vecs = [[[(random(x,y, i)-0.5)*2 for i in range(2)] for y in range(width+1)] for x in range(height+1)]
screen = pygame.display.set_mode((width*pixelsPerSquare, height*pixelsPerSquare))


def map(value:float, prevMin:float=0, prevMax:float=1, newMin:float=0, newMax:float=1):
    return (value-prevMin)/(prevMax-prevMin)*(newMax-newMin) + newMin

scale = 1/pixelsPerSquare
def value2col(value:float):
    value = smoothstepbig((value)*scale)
    return (-value*255 if value < 0 else 0, value*255 if value > 0 else 0, 0)

half = 1/2
def smoothstepbig(value:float):
    """Between -1 and 1"""
    if value < -1:
        return -1
    if value > 1:
        return 1
    return -value*(value**2-3)*half

def smoothstepsmall(value:float):
    """Between 0 and 1"""
    if value < 0:
        return 0
    if value > 1:
        return 1
    return 3*value**2 - 2*value**3


running = True
while running:
    t = time.time()
    screen.fill((0,0,0))

    m = 0
    for Y in range(width):
        for X in range(height):
            vecDiffs = [[vecs[Y][X], vecs[Y][X+1]], [vecs[Y+1][X], vecs[Y+1][X+1]]]
            for y in range(pixelsPerSquare):
                ypos = Y*pixelsPerSquare + y
                for x in range(pixelsPerSquare):
                    xpos = X*pixelsPerSquare + x

                    final = 0
                    for ydiff in range(2):
                        for xdiff in range(2):
                            value = (x-(pixelsPerSquare if xdiff else 0))*vecDiffs[ydiff][xdiff][0] + (y-(pixelsPerSquare if ydiff else 0))*vecDiffs[ydiff][xdiff][1]
                            final += value*smoothstepsmall(map(x, 0, pixelsPerSquare, not xdiff, xdiff))*smoothstepsmall(map(y, 0, pixelsPerSquare, not ydiff, ydiff))
                    if final > m:
                        m = final
                    screen.set_at((xpos, ypos), value2col(final))

    for X in range(width+1):
        for Y in range(height+1):
            screen.set_at((X*pixelsPerSquare, Y*pixelsPerSquare), (255, 255, 255))



pygame.quit()