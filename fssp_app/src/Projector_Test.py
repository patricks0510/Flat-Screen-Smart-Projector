## The three distance sensors publish their readings to
## http://192.168.4.1/sensors with the general form:
## {'J2': '42.00', 'J3': '37.00', 'J4': '6.00'}
## where J2, J3, and J4 are the labels of each sensor on the pcb silkscreen

## Image data is received as a byte array, where each byte corresponds to
## the number of adjacent pixels that have the same color minus 1
## (first byte is assumed to be # of black pixels, then white, then black, etc)
##
## Ex: 0xff, 0x01, 0x05
##
## 255 - 1 = 254 black pixels
## 1 - 1 = 0 white pixels
## 5 - 1 = 4 black pixels
##
## pixels are placed on screen left to right like reading a book,
## and wrap around to a new line after 400 pixels
## total resolution is 400 pixels across by 300 pixels tall

import requests
import time

image = b'\x01\xff'*5000 #for white screen
image = b'\xff\x01'*5000 #for black screen
image = b'\xc9\xc9'*5000 #for left half black, right half white
                         #(0xc9 - 1 = 0xc8 = 200)

postExample = requests.post("http://192.168.4.1/text", data = image, headers = {'Content-Type': 'application/octet-stream'})
print(postExample.text) #returns "ok" and makes screen half black half white

getExample = requests.get("http://192.168.4.1/sensors")
print(getExample.json()) #returns {'J2': '42.00', 'J3': '37.00', 'J4': '6.00'}

