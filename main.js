const electron = require('electron');
const { app, BrowserWindow } = electron;
var windows = {};

try {
    app.on('window-all-closed', function () {
        if (process.platform != 'darwin') {
            app.quit();
        }
    });
    app.on('ready', function () {
        windows["main"] = new BrowserWindow({ width: 1200, height: 900, title: "SPGizmos", defaultEncoding: "utf8" });
        windows["main"].loadURL('file://' + __dirname + '/index.html');
        windows["main"].toggleDevTools();
        windows["main"].on('closed', function () {
            delete windows["main"];
        });
    });
}
catch (ex) {
    console.log(ex);
    ex.stack && console.log(ex.stack);
}