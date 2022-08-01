const express = require("express");
const fs = require("fs");
const bmp = require('bmp-js');
const BmpImage = require('./BmpImage');
const transformer = require('./applyTransform');
const app = express();

app.get("/transform", (request, response) => {
    let image = request.body;
    let image_url = URL.createObjectURL(image);
    var pic = new BmpImage(image_url)
    let newpixelStream = transformer.applyTransform(pic.pixelStream,pic.bmpData.height,pic.bmpData.width,lT)
    pic.overwritePxStream(newpixelStream)
    pic.ge
});

app.post("/")

app.listen(3001, () => {
    console.log("Listen on the port 3001...");
});