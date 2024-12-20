import requests
from PIL import Image

# Load the image from the URL
image_url = "https://www.th.gov.bc.ca/ATIS/lgcws/images/lions_gate/queue_map.gif"
image = Image.open(requests.get(image_url, stream=True).raw)

# Get the color of pixel at position (10, 10)
r,g,b,a = image.getpixel((10, 10))

print("Color at pixel (10, 10):", r,g,b,a)