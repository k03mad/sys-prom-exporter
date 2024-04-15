import os from 'node:os';

const env = {
    server: {
        port: process.env.npm_config_port
        || process.env.SYS_EXPORTER_PORT
        || 11_014,
    },
    metrics: {
        turnOff: process.env.npm_config_turnoff
        || process.env.SYS_EXPORTER_METRICS_TURN_OFF,
    },
    debug: process.env.DEBUG,
    geoip: {
        cacheDir: `${os.homedir()}/.ip2geo-cache`,
    },
};

export default env;
