import React from "react";
import { Frame } from "./Frame";
import './ImageTabComponent.scss';

interface ImageTabProps {

}

interface ImageTabState {
    imageUploaded: boolean;
    originalImage: Blob | null;
    transformedImage: Blob | null;
}

export class ImageTabComponent extends React.Component<ImageTabProps, ImageTabState> {
    constructor(props: Readonly<ImageTabProps>) {
        super(props);
        this.state = {
            imageUploaded : false,
            originalImage: null,
            transformedImage: null
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
        return this.state.originalImage;
    }

    startProjection = () => {

    }

    render() {
        return (
            <div className="image-tab">
                <h1>Image</h1>
                <Frame className='image-frame-orig'>
                    <img id="orig_img" className="image"/>
                </Frame>
                <input
                        accept="image/bmp"
                        type="file"
                        onChange={this.uploadImage}
                    />
                <h2 className='image-frame-orig caption'>Original Image</h2>
                <Frame className='image-frame-tran'>
                    <img id="trans_img" className="image"/>
                </Frame>
                <button id="" className='image-project-button' onClick={() => this.startProjection()}>Start Projection</button>
                <h2  className='image-frame-tran caption'>Transformed Image</h2>
            </div>
        );
    }
}

