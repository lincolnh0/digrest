const {
    contextBridge,
    ipcRenderer
} = require("electron");

const yaml = require('js-yaml');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
    "digrest", {
        send: (channel, data) => {
            // whitelist channels
            let validChannels = ["toMain"];
            if (validChannels.includes(channel)) {
                ipcRenderer.send(channel, data);
            }
        },
        receive: (channel, func) => {
            let validChannels = ["fromMain"];
            if (validChannels.includes(channel)) {
                // Deliberately strip event as it includes `sender` 
                ipcRenderer.on(channel, (event, ...args) => func(...args));
            }
        },
        yamlDump: (object) => {
            return yaml.dump(object);
            
        }
    }
);
