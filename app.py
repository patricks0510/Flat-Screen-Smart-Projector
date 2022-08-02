
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

    # request sensor dists
    J2, J3, J4 = get_sensor_dists()
    print(J2, J3, J4)
    
    # linear transform
    # TBD, end up having an image called transform.bmp

    # compress and send
    img_bytes = img_compressed('transform.bmp')                     
    requests.post('http://192.168.4.1/text', data=img_bytes, 
        headers = {'Content-Type': 'application/octet-stream'})

    # send an image from the filesystem back to the frontend
    return img_data_url('transform.bmp')        


def save_img(data_url_bytes, img_name):
    s = data_url_bytes.decode('utf-8')
    response = urllib.request.urlopen(s)
    f = open(img_name, 'wb')
    f.write(response.file.read())
    f.close()


def get_sensor_dists():
    J2s = []
    J3s = []
    J4s = []

    for i in range(3):
        dists = requests.get('http://192.168.4.1/sensors').json()
        J2, J3, J4 = float(dists['J2']), float(dists['J3']), float(dists['J4'])
        J2s.append(J2)
        J3s.append(J3)
        J4s.append(J4)
        time.sleep(0.1) # 0.1 seconds

    J2s.sort()
    J3s.sort()
    J4s.sort()

    return J2s[1], J3s[1], J4s[1]


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
