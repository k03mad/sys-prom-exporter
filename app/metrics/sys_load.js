import {getCurrentFilename} from '../helpers/paths.js';
import {run} from '../helpers/shell.js';

const CMD = 'uptime';

const re = /.+up (?<uptime>.+),.+\d+\s+users.+load average: (?<one>[\d,]+), (?<five>[\d,]+), (?<fifteen>[\d,]+)/

const getNumberFromLoad = load => Number(load.replace(',', '.'));

export default {
    name: getCurrentFilename(import.meta.url),
    help: 'Load',
    labelNames: [
        'name',
        'type',
    ],

    async collect(ctx) {
        ctx.reset();

        const {stdout} = await run(CMD);

        const load = stdout.match(re);

        ctx.labels('uptime', load.groups.uptime).set(1);

        ctx.labels('load', '1m').set(getNumberFromLoad(load.groups.one));
        ctx.labels('load', '5m').set(getNumberFromLoad(load.groups.five));
        ctx.labels('load', '15m').set(getNumberFromLoad(load.groups.fifteen));
    },
};
