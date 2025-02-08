const { app, BrowserWindow, net, ipcMain, session } = require('electron');
const path = require('path');
const fs = require('fs'); // Import the file system module

let mainWindow;

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 1100,
		height: 600,
		icon: path.join(__dirname, 'src/imgs/vixen.png'), // Change the icon path as needed
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true, // Enables Node.js integration in the renderer process
        },
		autoHideMenuBar: false,
	});
	session.defaultSession.webRequest.onBeforeSendHeaders(
		{ urls: ["*://*.keylocking.ru/*"] }, // Match the URLs you want to modify
		(details, callback) => {
		  details.requestHeaders['Origin'] = 'https://lewblivehdplay.ru';
		  callback({ cancel: false, requestHeaders: details.requestHeaders });
		}
	  );

	mainWindow.loadFile('src/html/index.html');

	mainWindow.on('closed', () => {
		mainWindow = null;
	});
}



app.whenReady().then(() => {
	createWindow();

	mainWindow.webContents.on('did-finish-load', () => {
		// fetchData();  // No longer calling directly here, triggered by renderer
	});

	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});

// Handle the request for channels data
ipcMain.handle('get-channels', async (event) => {
	try {
		const channelsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'channels.json'), 'utf8'));
		return channelsData;
	} catch (error) {
		console.error("Error reading channels.json:", error);
		return []; // Return an empty array in case of error
	}
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit();
});