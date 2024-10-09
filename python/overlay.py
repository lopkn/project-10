import pyglet

class TransparentWindow(pyglet.window.Window):
    def __init__(self):
        super().__init__(fullscreen=False, resizable=True)
        self.set_exclusive_mouse(False)
        self.set_mouse_visible(False)
        self.set_location(100, 100)  # Position of the window

    def on_draw(self):
        self.clear()
        # Example: Draw a semi-transparent rectangle
        pyglet.graphics.draw(4, pyglet.gl.GL_QUADS,
            # ('v2f', [0, 0, 200, 0, 200, 200, 0, 200]),
            # ('c4B', [255, 0, 0, 128] * 4)  # Red with 50% transparency
        )

if __name__ == '__main__':
    window = TransparentWindow()
    pyglet.app.run()