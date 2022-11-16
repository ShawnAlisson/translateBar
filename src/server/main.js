const { app, BrowserWindow } = require("electron");

const { is } = require("electron-util");

const path = require("path");
const Store = require("electron-store");
const TrayGenerator = require("./TrayGenerator");

let mainWindow = null;
let trayObject = null;

const gotTheLock = app.requestSingleInstanceLock();

const store = new Store();

const initStore = () => {
  if (store.get("launchAtStart") === undefined) {
    store.set("launchAtStart", true);
  }

  if (store.get("useShortcut") === undefined) {
    store.set("useShortcut", true);
  }
};

const createMainWindow = () => {
  mainWindow = new BrowserWindow({
    transparent: true,
    width: 500,
    height: 320,
    show: false,
    frame: false,
    fullscreenable: false,
    resizable: false,
    webPreferences: {
      devTools: is.development,
      webviewTag: true,
      backgroundThrottling: false,
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });

  if (is.development) {
    mainWindow.webContents.openDevTools({ mode: "detach" });
    mainWindow.loadURL(
      `file://${path.join(__dirname, "../../src/client/index.html")}`
    );
  } else {
    mainWindow.loadURL(
      `file://${path.join(__dirname, "../../src/client/index.html")}`
    );
  }
};

const createTray = () => {
  trayObject = new TrayGenerator(mainWindow, store);
  trayObject.createTray();
};

if (!gotTheLock) {
  app.quit();
} else {
  app.on("ready", () => {
    initStore();
    createMainWindow();
    createTray();
  });

  app.on("second-instance", () => {
    if (mainWindow) {
      trayObject.showWindow();
    }
  });

  if (!is.development) {
    app.setLoginItemSettings({
      openAtLogin: store.get("launchAtStart"),
    });
  }

  app.dock.hide();
}
