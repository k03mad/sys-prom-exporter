import {getCurrentFilename} from '../helpers/paths.js';
import {run} from '../helpers/shell.js';

const THERMAL_ZONES = [0, 1, 2, 3];
const CMD = zone => `cat /sys/class/thermal/thermal_zone${zone}/temp`;

export default {
    name: getCurrentFilename(import.meta.url),
    help: CMD,
    labelNames: ['type', 'zone'],

    async collect(ctx) {
        ctx.reset();

        await Promise.all(THERMAL_ZONES.map(async zone => {
            const cpuTemp = await run(CMD);
            ctx.labels('cpu', zone).set(Number(cpuTemp.trim()) / 1000);
        }));
    },
};
