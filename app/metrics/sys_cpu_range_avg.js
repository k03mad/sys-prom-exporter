import {getCurrentFilename} from '../helpers/paths.js';
import {run} from '../helpers/shell.js';

const CMD = 'mpstat 1 2';

export default {
    name: getCurrentFilename(import.meta.url),
    help: CMD,
    labelNames: ['type'],

    async collect(ctx) {
        ctx.reset();

        const stdout = await run(CMD);
        const table = stdout.split('\n');

        const headers = table[2].split(/\s+/);

        table[6].split(/\s+/).forEach((cell, i) => {
            if (i >= 2) {
                ctx.labels(headers[i].replace('%', '')).set(Number(cell.replace(',', '')));
            }
        });
    },
};
