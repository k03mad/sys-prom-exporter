import {getCurrentFilename} from '../helpers/paths.js';
import {run} from '../helpers/shell.js';

const CMD = 'cat /proc/loadavg';
const re = /(?<one>[\d.]+)\s+(?<five>[\d.]+)\s+(?<fifteen>[\d.]+)/;

export default {
    name: getCurrentFilename(import.meta.url),
    help: CMD,
    labelNames: ['type'],

    async collect(ctx) {
        ctx.reset();

        const stdout = await run(CMD);
        const load = stdout.match(re);

        ctx.labels('1m').set(Number(load.groups.one));
        ctx.labels('5m').set(Number(load.groups.five));
        ctx.labels('15m').set(Number(load.groups.fifteen));
    },
};
