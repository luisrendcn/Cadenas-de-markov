const fs = require("fs/promises");
const path = require("path");
const { app, BrowserWindow, dialog, ipcMain } = require("electron");
const { startApiServer } = require("../api/server");

let mainWindow = null;
let apiController = null;
let apiUrl = "";

function withExtension(filePath, extension) {
  return path.extname(filePath) ? filePath : `${filePath}.${extension}`;
}

function registerIpcHandlers() {
  ipcMain.handle("api:get-url", () => apiUrl);

  ipcMain.handle("export:pdf", async () => {
    if (!mainWindow) {
      throw new Error("The application window is not ready.");
    }

    const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
      title: "Export Markov report as PDF",
      defaultPath: "markov-chain-report.pdf",
      filters: [{ name: "PDF", extensions: ["pdf"] }]
    });

    if (canceled || !filePath) {
      return { canceled: true };
    }

    const pdf = await mainWindow.webContents.printToPDF({
      landscape: true,
      printBackground: true,
      pageSize: "A4"
    });

    const targetPath = withExtension(filePath, "pdf");
    await fs.writeFile(targetPath, pdf);

    return { canceled: false, filePath: targetPath };
  });

  ipcMain.handle("export:csv", async (event, csv) => {
    if (!mainWindow) {
      throw new Error("The application window is not ready.");
    }

    const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
      title: "Export Markov report as CSV",
      defaultPath: "markov-chain-report.csv",
      filters: [{ name: "CSV", extensions: ["csv"] }]
    });

    if (canceled || !filePath) {
      return { canceled: true };
    }

    const targetPath = withExtension(filePath, "csv");
    await fs.writeFile(targetPath, csv, "utf8");

    return { canceled: false, filePath: targetPath };
  });
}

async function createMainWindow() {
  apiController = await startApiServer({
    port: Number(process.env.MARKOV_API_PORT || 0)
  });
  apiUrl = apiController.url;

  mainWindow = new BrowserWindow({
    width: 1440,
    height: 940,
    minWidth: 1080,
    minHeight: 720,
    title: "Markov Chain Desktop Suite",
    backgroundColor: "#f4f8fb",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });

  await mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));

  if (process.env.ELECTRON_OPEN_DEVTOOLS === "1") {
    mainWindow.webContents.openDevTools({ mode: "detach" });
  }

  const autoQuitMs = Number(process.env.MARKOV_AUTO_QUIT_MS || 0);
  if (autoQuitMs > 0) {
    setTimeout(() => app.quit(), autoQuitMs);
  }
}

registerIpcHandlers();

app.whenReady().then(createMainWindow).catch((error) => {
  dialog.showErrorBox("Startup error", error.message);
  app.quit();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});

app.on("before-quit", () => {
  if (apiController) {
    apiController.server.close();
  }
});
