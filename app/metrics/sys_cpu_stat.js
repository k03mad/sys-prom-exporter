import {getCurrentFilename} from '../helpers/paths.js';
import {run} from '../helpers/shell.js';

const CMD = 'vmstat 1 2';

export default {
    name: getCurrentFilename(import.meta.url),
    help: CMD,
    labelNames: ['type'],

    async collect(ctx) {
        ctx.reset();

        const stdout = await run(CMD);
        const table = stdout.split('/n');

        const headers = table[1].split(/\s+/);

        table[3].split(/\s+/).forEach((cell, i) => {
            if (i >= 12) {
                ctx.labels(headers[i]).set(Number(cell));
            }
        });
    },
};
