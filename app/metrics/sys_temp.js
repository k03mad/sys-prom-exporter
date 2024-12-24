import {getCurrentFilename} from '../helpers/paths.js';
import {run} from '../helpers/shell.js';

const CMD = 'cat /sys/class/thermal/thermal_zone0/temp';

export default {
    name: getCurrentFilename(import.meta.url),
    help: CMD,
    labelNames: ['type'],

    async collect(ctx) {
        ctx.reset();

        const cpuTemp = await run(CMD);
        ctx.labels('cpu').set(Number(cpuTemp.trim()) / 1000);
    },
};
