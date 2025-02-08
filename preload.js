const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  fetchData: (name, number) => ipcRenderer.send('fetch-data-request', name, number),
  onDataReceived: (callback) => ipcRenderer.on('data-received', callback),
  onDataError: (callback) => ipcRenderer.on('data-error', callback),
  getChannels: () => ipcRenderer.invoke('get-channels'),
});
