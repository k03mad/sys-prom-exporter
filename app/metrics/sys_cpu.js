import {getCurrentFilename} from '../helpers/paths.js';
import {run} from '../helpers/shell.js';

const CMD = 'mpstat';

export default {
    name: getCurrentFilename(import.meta.url),
    help: CMD,
    labelNames: ['type'],

    async collect(ctx) {
        ctx.reset();

        const stdout = await run(CMD);
        const table = stdout.split('\n');

        const headers = table[2]
            .split(/\s+/)
            .filter(elem => elem.includes('%'))
            .map(elem => elem.replace('%', ''));

        const values = table[3]
            .split(/\s+/)
            .filter(elem => elem.includes(','))
            .map(elem => Number(elem.replace(',', '.')));

        headers.forEach((header, i) => {
            ctx.labels(header).set(values[i]);
        });
    },
};
