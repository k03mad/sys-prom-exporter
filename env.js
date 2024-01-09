const env = {
    server: {
        port: process.env.npm_config_port
        || process.env.SYS_EXPORTER_PORT
        || 11_014,
    },
    debug: process.env.DEBUG,
};

export default env;
