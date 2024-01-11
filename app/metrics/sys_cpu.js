import {getCurrentFilename} from '../helpers/paths.js';
import {run} from '../helpers/shell.js';

const CMD = 'top -ibn1';

const RE = {
    cpu: /(?<User>[\d,]+)\s+us,\s+(?<System>[\d,]+)\s+sy,\s+(?<Nice>[\d,]+)\s+ni,\s+(?<Idle>[\d,]+)\s+id,\s+(?<IoWait>[\d,]+)\s+wa,\s+(?<HardIrq>[\d,]+)\s+hi,\s+(?<SoftIrq>[\d,]+)\s+si,\s+(?<Steal>[\d,]+)\s+st/,
    load: /load average:\s+(?<_1m>[\d,]+),\s+(?<_5m>[\d,]+),\s+(?<_15m>[\d,]+)/,
    uptime: /up\s(.+),\s+\d+\s+user/,
};

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
        const loadGroups = stdout.match(RE.load).groups;
        const uptime = stdout.match(RE.uptime)[1];

        Object.entries(cpuGroups).forEach(([type, num]) => {
            ctx.labels('cpu', type).set(Number(num.replace(',', '.')));
        });

        Object.entries(loadGroups).forEach(([type, num]) => {
            ctx.labels('load', type).set(Number(num.replace(',', '.')));
        });

        ctx.labels('uptime', uptime).set(1);
    },
};
