const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("markovDesktop", {
  getApiUrl: () => ipcRenderer.invoke("api:get-url"),
  exportPdf: () => ipcRenderer.invoke("export:pdf"),
  exportCsv: (csv) => ipcRenderer.invoke("export:csv", csv)
});
