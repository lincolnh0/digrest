const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const yaml = require('js-yaml');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

let win;

async function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1600,
    height: 900,
    webPreferences: {
      contextIsolation: true, // protect against prototype pollution
      enableRemoteModule: false, // turn off remote
      preload: path.join(__dirname, 'preload.js'), // use a preload script
    }
  });


  // and load the index.html of the app.
  win.loadFile(path.join(__dirname, '../dist/html/index.html'));

};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

ipcMain.on("toMain", (event, args) => {
  console.log(args)
  // yaml.dump("path/to/file", (error, data) => {
  //   // Do something with file contents

  //   // Send result back to renderer process
  //   win.webContents.send("fromMain", responseObj);
  // });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
