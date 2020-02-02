const {app, BrowserWindow} = require('electron');
const path = require('path');
require('./hydra-server/server');

// Allow insecure HTTPS on localhost
app.commandLine.appendSwitch('ignore-certificate-errors', 'true');
app.commandLine.appendSwitch('allow-insecure-localhost', 'true');
let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    backgroundColor: '#000',
    frame: false,
    webPreferences: {},
    simpleFullscreen: true,
    fullscreen: true,
  });

  mainWindow.loadURL('https://localhost:8000');

  mainWindow.on('closed', () => (mainWindow = null));
};

app.on('ready', createWindow);

app.on('window-all-closed', () =>
  process.platform !== 'darwin' ? app.quit() : null,
);

app.on('activate', () => (mainWindow === null ? createWindow() : null));
