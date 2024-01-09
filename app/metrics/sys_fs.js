import {getCurrentFilename} from '../helpers/paths.js';
import {run} from '../helpers/shell.js';

const UNIT = 'KiB';
const CMD = `df -B${UNIT}`;

const removeValueUnit = value => Number(value.replace(new RegExp(`${UNIT}|%`), ''));

export default {
    name: getCurrentFilename(import.meta.url),
    help: 'Filesystem',
    labelNames: [
        'type',
        'mounted',
    ],

    async collect(ctx) {
        ctx.reset();

        const stdout = await run(CMD);
        const table = stdout.split('\n');

        table.forEach(row => {
            const cells = row.split(/\s+/);

            ctx.labels(`total_${UNIT}`, cells[5]).set(removeValueUnit(cells[1]));
            ctx.labels(`used_${UNIT}`, cells[5]).set(removeValueUnit(cells[2]));
            ctx.labels(`available_${UNIT}`, cells[5]).set(removeValueUnit(cells[3]));
            ctx.labels('used_percent', cells[5]).set(removeValueUnit(cells[4]));
        });
    },
};
