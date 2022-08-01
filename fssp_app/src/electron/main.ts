import { IpcMainEvent } from "electron";
import Matrix2x2 from "../matrix2x2";

const { app, BrowserWindow, screen: electronScreen, ipcMain } = require('electron');

const createMainWindow = () => {
  let mainWindow = new BrowserWindow({
    width: electronScreen.getPrimaryDisplay().workArea.width,
    height: electronScreen.getPrimaryDisplay().workArea.height,
    show: false,
    backgroundColor: 'white',
    webPreferences: {
      nodeIntegration: false
    }
  });
  const startURL = 'http://localhost:3000';

  mainWindow.loadURL(startURL);

  mainWindow.once('ready-to-show', () => mainWindow.show());

  mainWindow.on('closed', () => {
    mainWindow.destroy();
  });
};

app.whenReady().then(() => {
  createMainWindow();

  app.on('activate', () => {
    if (!BrowserWindow.getAllWindows().length) {
      createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.on('transform', (event: IpcMainEvent, path: URL, lT: Matrix2x2) => {
    const BmpImage = require('./BmpImage.js')
    const transformer = require('./applyTransform.js')

    var pic = new BmpImage(path)
    console.log(pic.bmpData.width)
    console.log(pic.bmpData.height)
    pic.pixelStream = transformer.applyTransform(pic.pixelStream,pic.bmpData.height,pic.bmpData.width,lT)
    pic.createNewBMP()

});


export {}