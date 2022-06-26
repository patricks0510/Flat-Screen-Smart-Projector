import React from 'react'
//import SmartTextInput from './SmartTextInput'
const { ipcRenderer } = window.require('electron')

// const App = () => (
//   <div>
//     <h1>Hello React</h1>
//   </div>
// )

export default class App extends React.Component{
  constructor (props) {
    super(props)
    this.state = {ready: false}
  }
  componentDidMount () {
    ipcRenderer.on('fetchData',(event,arg) => {
      this.setState({ready: arg.ready})
    })
    this.intervalId = setInterval(() => { ipcRenderer.send('requestData') }, 50)
  }

  componentWillUnmount () {
    ipcRenderer.removeAllListeners('fetchData')
  }

  render() { return <div>
    <h1>Triangle Shear</h1>
  </div>}
}

