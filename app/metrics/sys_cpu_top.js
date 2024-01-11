import {getCurrentFilename} from '../helpers/paths.js';
import {run} from '../helpers/shell.js';

const CMD = 'top -ibn1';
const RE = /(?<usr>[\d,]+)\s+us,\s+(?<sys>[\d,]+)\s+sy,\s+(?<nice>[\d,]+)\s+ni,\s+(?<idle>[\d,]+)\s+id,\s+(?<iowait>[\d,]+)\s+wa,\s+(?<irq>[\d,]+)\s+hi,\s+(?<soft>[\d,]+)\s+si,\s+(?<steal>[\d,]+)\s+st/;

export default {
    name: getCurrentFilename(import.meta.url),
    help: CMD,
    labelNames: ['type'],

    async collect(ctx) {
        ctx.reset();

        const stdout = await run(CMD);
        const data = stdout.match(RE).groups;

        Object.entries(data).forEach(([type, num]) => {
            ctx.labels(type).set(Number(num.replace(',', '.')));
        });
    },
};
