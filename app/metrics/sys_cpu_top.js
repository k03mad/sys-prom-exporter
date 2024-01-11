import {getCurrentFilename} from '../helpers/paths.js';
import {run} from '../helpers/shell.js';

const CMD = 'top -ibn1';
const RE = /(?<User>[\d,]+)\s+us,\s+(?<System>[\d,]+)\s+sy,\s+(?<Nice>[\d,]+)\s+ni,\s+(?<Idle>[\d,]+)\s+id,\s+(?<IoWait>[\d,]+)\s+wa,\s+(?<HardIrq>[\d,]+)\s+hi,\s+(?<SoftIrq>[\d,]+)\s+si,\s+(?<Steal>[\d,]+)\s+st/;

export default {
    name: getCurrentFilename(import.meta.url),
    help: CMD,
    labelNames: [
        'name',
        'type',
    ],

    async collect(ctx) {
        ctx.reset();

        const stdout = await run(CMD);
        const cpuGroups = stdout.match(RE.cpu).groups;

        Object.entries(cpuGroups).forEach(([type, num]) => {
            ctx.labels(type).set(Number(num.replace(',', '.')));
        });
    },
};
