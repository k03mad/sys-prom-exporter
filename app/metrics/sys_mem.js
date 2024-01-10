import {getCurrentFilename} from '../helpers/paths.js';
import {run} from '../helpers/shell.js';

const CMD = 'cat /proc/meminfo';
const UNIT = 'kB';

const NAMES_EXCLUDE = new Set(['VmallocTotal']);

export default {
    name: getCurrentFilename(import.meta.url),
    help: CMD,
    labelNames: ['type'],

    async collect(ctx) {
        ctx.reset();

        const stdout = await run(CMD);
        const table = stdout.split('\n');

        table.forEach(row => {
            const cells = row.split(/\s+/);
            const name = cells[0].replace(':', '');

            if (
                cells[2] === UNIT
                && !NAMES_EXCLUDE.has(name)
            ) {
                ctx.labels(name).set(Number(cells[1]));
            }
        });
    },
};
