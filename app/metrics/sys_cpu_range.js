import {getCurrentFilename} from '../helpers/paths.js';
import {run} from '../helpers/shell.js';

const CMD = 'mpstat 1 3 -o JSON';

export default {
    name: getCurrentFilename(import.meta.url),
    help: CMD,
    labelNames: ['type'],

    async collect(ctx) {
        ctx.reset();

        const stdout = await run(CMD);

        const stats = JSON.parse(stdout)
            .sysstat
            .hosts[0]
            .statistics
            .at(-1)['cpu-load'][0];

        Object.entries(stats).forEach(([type, value]) => {
            if (typeof value === 'number') {
                ctx.labels(type).set(value);
            }
        });
    },
};
