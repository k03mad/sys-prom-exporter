import {getCurrentFilename} from '../helpers/paths.js';
import {run} from '../helpers/shell.js';

const CMD = 'free -b';

const re = {
    mem: /Mem: +(?<total>\d+) +(?<used>\d+) +(?<free>\d+) +(?<shared>\d+) +(?<buff>\d+) +(?<available>\d+)/,
    swap: /Swap: +(?<total>\d+) +(?<used>\d+) +(?<free>\d+)/,
};

export default {
    name: getCurrentFilename(import.meta.url),
    help: 'Filesystem',
    labelNames: [
        'name',
        'type',
    ],

    async collect(ctx) {
        ctx.reset();

        const {stdout} = await run(CMD);

        const mem = stdout.match(re.mem);
        const swap = stdout.match(re.swap);

        Object.entries(mem.groups).forEach(([type, value]) => {
            ctx.labels('mem', type).set(Number(value));
        });

        Object.entries(swap.groups).forEach(([type, value]) => {
            ctx.labels('swap', type).set(Number(value));
        });
    },
};
