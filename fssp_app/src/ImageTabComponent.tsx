import { blob } from "node:stream/consumers";
import React from "react";
import { Frame } from "./Frame";
import './ImageTabComponent.scss';

interface ImageTabProps {
    ultra1: number;
    ultra2: number;
    ultra3: number;
}

interface ImageTabState {
    imageUploaded: boolean;
    originalImage: Blob | null;
    transformedImage: Blob | null;
    imageProjecting: boolean;
}

export class ImageTabComponent extends React.Component<ImageTabProps, ImageTabState> {
    constructor(props: Readonly<ImageTabProps>) {
        super(props);
        this.state = {
            imageUploaded : false,
            originalImage: null,
            transformedImage: null,
            imageProjecting: false
        };
        
    }


    uploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            this.setState({imageUploaded: true, originalImage: e.target.files[0]}, () => {
                console.log(this.state.originalImage);
                console.log(this.state.imageUploaded);
                
                const orig_div = document.getElementById("orig_img") as HTMLImageElement;
                if (orig_div){
                    orig_div.src = URL.createObjectURL(this.state.originalImage!);
                }
                this.setState({transformedImage: this.transformImage()}, () => {
                    const trans_div = document.getElementById("trans_img") as HTMLImageElement;
                    if (trans_div){
                        trans_div.src = URL.createObjectURL(this.state.transformedImage!);
                    }
                });
                
            });
        }
    }

    transformImage = () => {
        /*var bmp = require("bmp-js");

        class bmpImage {

            bmpData;

            constructor(file: Blob | null){
                this.bmpData = bmp.decode(file!.arrayBuffer());   
            }
        };

        var filename = URL.createObjectURL(this.state.originalImage!);
        var pic = new bmpImage(this.state.originalImage);
        //could have the UI module send a pixel array object, I work with that, and then send a pixel array back
        let pixelArray = [...pic.bmpData.data];

        for(let i = 0; i < pixelArray.length; i+=3){
            //skip A bit of ARGB
            i += 1
            for(let j = 0; j < 3; j++){
                if(pixelArray[i+j] == 0){
                    pixelArray[i+j] = 170
                }
            }
        }

        pic.bmpData.data = pixelArray;
        console.log(pic.bmpData);
        var editImg = bmp.encode(pic.bmpData);
        console.log(editImg);
        
        return editImg;*/
        return this.state.originalImage;
    }

    toggleProjection = () => {
        if (this.state.imageProjecting)
            this.stopProjection();
        else
            this.startProjection();
    }

    startProjection = () => {
        this.setState({imageProjecting: true});

        fetch("http://192.168.4.1/sensors", {method: 'POST', mode: 'no-cors', headers: {'Content-Type': 'application/octet-stream', 'Access-Control-Allow-Origin': '*'}}).then((response) => {
        if (response.ok) return response.json();
        }).then((json) => {document.getElementById("proj_button")!.innerText = "Stop Projection";
                            document.getElementById("proj_button")!.style.backgroundColor = 'red';})

        
    }

    stopProjection = () => {
        this.setState({imageProjecting: false});
        document.getElementById("proj_button")!.innerText = "Start Projection";
        document.getElementById("proj_button")!.style.backgroundColor = 'green';
    }

    render() {
        return (
            <div className="image-tab">
                <h1>Image</h1>
                <Frame className='image-frame-orig'>
                    <img id="orig_img" className="image"/>   
                </Frame>
                <input className="image-upload-btn"
                        accept="image/bmp"
                        type="file"
                        onChange={this.uploadImage}
                    />
                <h2 className='image-frame-orig caption'>Original Image</h2>
                <Frame className='image-frame-tran'>
                    <img id="trans_img" className="image"/>
                </Frame>
                <button id="proj_button" className='image-project-button' onClick={() => this.toggleProjection()}>Start Projection</button>
                <h2  className='image-frame-tran caption'>Transformed Image</h2>
            </div>
        );
    }
}

