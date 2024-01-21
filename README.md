• [ctrld-prom-exporter](https://github.com/k03mad/ctrld-prom-exporter) \
• [mik-prom-exporter](https://github.com/k03mad/mik-prom-exporter) \
• [mosobleirc-prom-exporter](https://github.com/k03mad/mosobleirc-prom-exporter) \
• [ping-prom-exporter](https://github.com/k03mad/ping-prom-exporter) \
• sys-prom-exporter \
• [tin-invest-prom-exporter](https://github.com/k03mad/tin-invest-prom-exporter) \
• [ya-iot-prom-exporter](https://github.com/k03mad/ya-iot-prom-exporter)

:: [grafana-dashboards](https://github.com/k03mad/grafana-dashboards/tree/master/export) ::

# [System — Prometheus] exporter

— Tested on `Ubuntu 22.04.3 LTS` \
— [Use correct Node.JS version](.nvmrc) \
— Start exporter:

```bash
# one time
npm run setup

# start app
npm run start --port=11000
# or with envs
SYS_EXPORTER_PORT=11000 npm run start
```
