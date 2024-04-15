import {getCurrentFilename} from '../helpers/paths.js';
import {run} from '../helpers/shell.js';

const CMD = 'cat /proc/stat';

const stats = [
    'user', 'nice', 'system', 'idle', 'iowait',
    'irq', 'softirq',
    'steal',
    'guest', 'gnice',
];

export default {
    name: getCurrentFilename(import.meta.url),
    help: CMD,
    labelNames: ['type'],

    async collect(ctx) {
        ctx.reset();

        const stdout = await run(CMD);
        const [cpu] = stdout.split('\n');
        const cpuCount = Number([...stdout.matchAll(/cpu(\d)/g)].pop()[1]) + 1;

        const row = cpu.split(/\s+/);

        stats.forEach((type, i) => {
            ctx.labels(type).set(Number(row[i + 1]) / cpuCount);
        });
    },
};
