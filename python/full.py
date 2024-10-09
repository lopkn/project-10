import pygame
from Quartz import CGWindowListCopyWindowInfo, kCGWindowListOptionOnScreenOnly, kCGNullWindowID
import os

# Initialize pygame
pygame.init()

# Set up the transparent window with pygame
width, height = 1920, 1080  # Or use display.Info() to get screen dimensions
screen = pygame.display.set_mode((width, height), pygame.NOFRAME | pygame.FULLSCREEN)
pygame.display.set_caption("Transparent Pixel Drawing Window")

# Set the window to be semi-transparent
os.environ['SDL_VIDEO_WINDOW_POS'] = "0,0"
screen.fill((0, 0, 0, 0))  # Transparent background

# Function to draw a pixel at the mouse position
def draw_pixel(x, y, color=(255, 0, 0)):
    screen.fill((0, 0, 0, 0))  # Clear the screen
    pygame.draw.circle(screen, color, (x, y), 5)  # Draw a small circle as a pixel

# Function to list all windows on screen (macOS Quartz)
def list_windows():
    windows = CGWindowListCopyWindowInfo(kCGWindowListOptionOnScreenOnly, kCGNullWindowID)
    return windows

# Main loop
running = True
while running:
    # Handle close events
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    # Get mouse position and draw pixels
    mouse_pos = pygame.mouse.get_pos()
    draw_pixel(mouse_pos[0], mouse_pos[1])

    # Update the display
    pygame.display.update()

# Quit pygame
pygame.quit()
