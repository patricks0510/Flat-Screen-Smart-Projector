import React from 'react';
import './App.scss';
import fs from 'fs';
import bmp from '@wokwi/bmp-ts';


import {ImageTabComponent} from "./ImageTabComponent";
import { ProjectionTabComponent } from './ProjectionTabComponent';
import { InfoTabComponent } from './InfoTabComponent';


enum TabState {
  image = 0,
  projection = 1,
  info = 2
}

interface AppProps{

}

interface AppState {
  tabState: TabState;
}


export class App extends React.Component<AppProps, AppState> {
    
    constructor(props: AppProps){
      super(props);
      this.state = {
        tabState: TabState.image
      };
    }


    render() {
      let main;

      if (this.state.tabState === TabState.image){
        main = <ImageTabComponent></ImageTabComponent>
      }
      else if (this.state.tabState === TabState.projection){
        main = <ProjectionTabComponent ultra1={0} ultra2={0} ultra3={0}></ProjectionTabComponent>
      }
      else if (this.state.tabState === TabState.info){
        main = <InfoTabComponent ultra1={0} ultra2={0} ultra3={0}></InfoTabComponent>
      }

      return (
        <div className='main'>
          <div className='App-header'>
            <h1>Flat Screen Smart Projector</h1>
          </div>

          <div className='tab'>
            <button className="tablinks" onClick={() => this.switchTab('image')}>Image</button>
            <button className="tablinks" onClick={() => this.switchTab('projection')}>Projection</button>
            <button className="tablinks" onClick={() => this.switchTab('info')}>Info</button>
          </div>

          <div className='main'>
          {main}
          </div>
        </div>        
      );
    }

    switchTab = (name: string) => {
        switch(name) {
          case 'image':
            this.setState({tabState: TabState.image});
            break;
          case 'projection':
            this.setState({tabState: TabState.projection});
            break;
          case 'info':
            this.setState({tabState: TabState.info});
            break;
        }
    }

}
