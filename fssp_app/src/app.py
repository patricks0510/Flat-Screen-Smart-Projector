
from flask import Flask, request
from flask_cors import CORS
import urllib
import base64
import cv2 as cv
import requests
import numpy as np
import time


app = Flask(__name__)
CORS(app)


@app.route('/post_img', methods=['GET', 'POST'])
def post_img():
    data_url_bytes = request.get_data()

    # save image from frontend to filesystem
    save_img(data_url_bytes, 'upload.bmp')

    return "OK"

    # # compress and send
    # img_bytes = img_compressed('transform.bmp')                      
    # requests.post('http://192.168.4.1/text', data=img_bytes, 
    #     headers = {'Content-Type': 'application/octet-stream'})
       


def save_img(data_url_bytes, img_name):
    s = data_url_bytes.decode('utf-8')
    response = urllib.request.urlopen(s)
    f = open(img_name, 'wb')
    f.write(response.file.read())
    f.close()


def img_compressed(img_name):
    src = cv.imread(img_name)
    img = []
    prev_color = 0
    count = 0
    for row in src:
        for pix in row:
            cur_color = 0 if pix[0] == 0 else 255
            if prev_color == cur_color:
                count += 1
                if count == 254:
                    img.append( (count+1).to_bytes(1,'big') )
                    prev_color = 0 if cur_color == 255 else 255
                    count = 0
                else:
                    prev_color = cur_color
            else:
                img.append( (count+1).to_bytes(1,'big') )
                count = 1
                prev_color = cur_color
    img.append( (count+1).to_bytes(1,'big') )
    return b''.join(img)


def img_data_url(img_name):
    f = open(img_name, 'rb')
    img_str = f.read()
    f.close()
    img_bytes = base64.b64encode(img_str)
    base64_img_str = img_bytes.decode('utf-8')
    return f'data:image/bmp;base64,{base64_img_str}'
 

if __name__ == '__main__':
    app.run()
