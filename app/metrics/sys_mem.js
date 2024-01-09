import {getCurrentFilename} from '../helpers/paths.js';
import {run} from '../helpers/shell.js';

const CMD = 'cat /proc/meminfo';

export default {
    name: getCurrentFilename(import.meta.url),
    help: 'Memory',
    labelNames: ['type'],

    async collect(ctx) {
        ctx.reset();

        const stdout = await run(CMD);
        const table = stdout.split('\n');

        table.forEach(row => {
            const cells = row.split(/\s+/);

            ctx.labels(
                cells[0].replace(':', '')
                + (cells[2] ? `_${cells[2]}` : ''),
            ).set(Number(cells[1]));
        });
    },
};
