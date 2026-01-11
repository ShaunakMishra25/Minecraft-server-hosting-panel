const fs = require('fs');
const path = require('path');

class ServerManager {
    constructor(configPath) {
        this.configPath = configPath;
        this.config = this.loadConfig();
    }

    loadConfig() {
        if (!fs.existsSync(this.configPath)) {
            return { active: null, servers: [] };
        }
        return JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
    }

    saveConfig() {
        fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 4));
    }

    getServers() {
        return this.config.servers;
    }

    getActiveServer() {
        if (!this.config.active) return null;
        return this.config.servers.find(s => s.id === this.config.active);
    }

    getServer(id) {
        return this.config.servers.find(s => s.id === id);
    }

    setActiveServer(id) {
        if (this.getServer(id)) {
            this.config.active = id;
            this.saveConfig();
            return true;
        }
        return false;
    }

    addServer(serverData) {
        // serverData: { id, name, path, jar, icon }
        if (this.getServer(serverData.id)) {
            return false;
        }
        this.config.servers.push(serverData);
        // If it's the first server, make it active
        if (!this.config.active) {
            this.config.active = serverData.id;
        }
        this.saveConfig();
        return true;
    }

    deleteServer(id) {
        const index = this.config.servers.findIndex(s => s.id === id);
        if (index !== -1) {
            this.config.servers.splice(index, 1);
            if (this.config.active === id) {
                this.config.active = this.config.servers.length > 0 ? this.config.servers[0].id : null;
            }
            this.saveConfig();
            return true;
        }
        return false;
    }
}

module.exports = ServerManager;
