# [System — Prometheus] exporter

— Tested on `Ubuntu 22.04.3 LTS` \
— [Use correct Node.JS version](.nvmrc) \
— Start exporter:

```bash
# one time
npm run setup

# start app
npm run start --port=11000 --turnoff=sys_ufw,sys_wg
# or with envs
SYS_EXPORTER_PORT=11000 SYS_EXPORTER_METRICS_TURN_OFF=sys_ufw,sys_wg npm run start
```

[grafana-dashboards](https://github.com/k03mad/grafana-dashboards/tree/master/export)
