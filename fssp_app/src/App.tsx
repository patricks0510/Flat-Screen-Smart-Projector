import React from 'react';
import './App.scss';
import fs from 'fs';
import bmp from '@wokwi/bmp-ts';


import {ImageTabComponent} from "./ImageTabComponent";
import { ProjectionTabComponent } from './ProjectionTabComponent';
import { InfoTabComponent } from './InfoTabComponent';
import { ServerResponse } from 'http';


enum TabState {
  image = 0,
  projection = 1,
  info = 2
}

interface AppProps{

}

interface AppState {
  ultra1: number;
  ultra2: number;
  ultra3: number;
  tabState: TabState;
  timer: number;
  logs: string;
}


export class App extends React.Component<AppProps, AppState> {
    
    constructor(props: AppProps){
      super(props);
      this.state = {
        ultra1: 0,
        ultra2: 0,
        ultra3: 0,
        tabState: TabState.image,
        timer: 1000,
        logs: ""
      };
    }

    componentDidMount() {
      this.fetchDistances();
      this.setState({timer: window.setInterval(() => this.fetchDistances(), 5000)});
    }

    componentWillUnmount() {
      clearInterval(this.state.timer);
      this.setState({timer: 0});
    }


    fetchDistances = () => {
    
      console.log("Fetching Distances");
      fetch("http://192.168.4.1/sensors", {mode: 'no-cors', headers: {'Access-Control-Allow-Origin': '*'}}).then((response) => {
        if (response.ok) return response.json();
      }).then((json) => this.setState({ultra1: json.J2, ultra2: json.J3, ultra3: json.J4, logs: this.state.logs + `(info)${new Date().toISOString()}: ${json.J2} ${json.J3} ${json.J4}\n\n`}));
    
    }

    render() {
      let main;

      if (this.state.tabState === TabState.image){
        main = <ImageTabComponent ultra1={this.state.ultra1} ultra2={this.state.ultra2} ultra3={this.state.ultra3}></ImageTabComponent>
      }
      else if (this.state.tabState === TabState.projection){
        main = <ProjectionTabComponent ultra1={this.state.ultra1} ultra2={this.state.ultra2} ultra3={this.state.ultra3}></ProjectionTabComponent>
      }
      else if (this.state.tabState === TabState.info){
        main = <InfoTabComponent ultra1={this.state.ultra1} ultra2={this.state.ultra2} ultra3={this.state.ultra3} logs={this.state.logs}></InfoTabComponent>
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
