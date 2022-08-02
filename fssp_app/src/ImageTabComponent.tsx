import { round } from "mathjs";
import React from "react";
import BmpImage from "./BmpImage";
import { Frame } from "./Frame";
import './ImageTabComponent.scss';
import Matrix2x2 from "./matrix2x2";

interface ImageTabProps {
    ultra1: number;
    ultra2: number;
    ultra3: number;
    lT: Matrix2x2;
}

interface ImageTabState {
    imageUploaded: boolean;
    originalImage: Blob | null;
    transformedImage: Blob | null;
    transformedStream: any;
    bmpbuffer: any;
    imageProjecting: boolean;
}

export class ImageTabComponent extends React.Component<ImageTabProps, ImageTabState> {
    constructor(props: Readonly<ImageTabProps>) {
        super(props);
        this.state = {
            imageUploaded : false,
            originalImage: null,
            transformedImage: null,
            transformedStream: null,
            imageProjecting: false,
            bmpbuffer: new ArrayBuffer(0)
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
                this.setOriginalBuffer();
                //this.transformImage(URL.createObjectURL(this.state.originalImage!));
                
            });
        }
    }


    setOriginalBuffer = () => {
        var bmp = require("bmp-js");
        var bufferReader = new FileReader();
        bufferReader.addEventListener('loadend', () => {
            let temp = bufferReader.result as string;
            let temp_buffer = bufferReader.result as ArrayBuffer;
            let temp_arr_buff = new Uint8Array(temp_buffer);
            console.log(temp_arr_buff)
            //console.log(temp_arr_buff.toString())
            this.setState({bmpbuffer: this.compressPixelArray(temp_arr_buff)}, () => {
                var trans_blob;
                console.log(this.state.bmpbuffer);
                console.log(this.state.bmpbuffer.toString());
                
            trans_blob = new Blob([temp], { type: 'application/octet-stream' });
        
            this.setState({transformedStream: temp, transformedImage: trans_blob}, () => {
                const trans_div = document.getElementById("trans_img") as HTMLImageElement;
                    if (trans_div){
                        trans_div.src = URL.createObjectURL(this.state.transformedImage!);
                    }
            });
            });
         });
        

        bufferReader.readAsArrayBuffer(this.state.originalImage!);
    }

    compressPixelArray = (buffer: Uint8Array): Uint8Array => {
        let compressed = new Array();
        let count = 1;
        let lastValue = 0;
        for(let i = 54; i < buffer.length; i++){
            if (round(buffer[i] / 255) * 255  == lastValue){
                count++;
                if (count > 255){
                    compressed.push(255);
                    compressed.push(1);
                    count = 1;
                }
            } else {
                lastValue = round(buffer[i] / 255) * 255;
                compressed.push(count);
                count = 1;
            }
        }
        let result = Uint8Array.from(compressed);
        /*
        for(let i = 54; i < buffer.length; i++){
            let rounded_val = round(buffer[i] / 255) * 255
            console.log(rounded_val)
            var base2 = (rounded_val).toString(2);
            for (let j = 0; j < 8; j++)
                if (base2[j]  == lastValue){
                    count++;
                    if (count > 255){
                        compressed.push(255);
                        compressed.push(1);
                        count = 1;
                    }
            } else {
                lastValue = base2[j];
                compressed.push(count);
                count = 1;
            }
        }
        */
        return result;
        //return result.fill(201);
    }

    transformImage = (url: string) => {
        

        var pic = new BmpImage(url)
        console.log(pic.bmpData.width)
        console.log(pic.bmpData.height)
        //pic.pixelStream = transformer.applyTransform(pic.pixelStream,pic.bmpData.height,pic.bmpData.width,lT)

        pic.createNewBMP()
    }

    sendProjection = () => {

        if(this.state.imageUploaded){
            fetch("http://127.0.0.1:5000/post_img", {method: 'POST', headers: {'Content-Type':'application/octet-stream'}, body: URL.createObjectURL(this.state.transformedImage!)})
            .then((response) => {
                if (response.ok) return response.json();
            });
        }
    } 

    render() {
        return (
            <div className="image-tab">
                <h1>Image</h1>
                <Frame className='image-frame-orig'>
                    <img id="orig_img" className="image" alt=""/>   
                </Frame>
                <input className="image-upload-btn"
                        accept="image/bmp"
                        type="file"
                        onChange={this.uploadImage}
                    />
                <h2 className='image-frame-orig caption'>Original Image</h2>
                <Frame className='image-frame-tran'>
                    <img id="trans_img" className="image" alt=""/>
                </Frame>
                <button id="proj_button" className='image-project-button' onClick={() => this.sendProjection()}>Send Projection</button>
                <h2  className='image-frame-tran caption'>Transformed Image</h2>
            </div>
        );
    }
}

