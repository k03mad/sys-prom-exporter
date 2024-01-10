import {getCurrentFilename} from '../helpers/paths.js';
import {run} from '../helpers/shell.js';

const UNIT = 'KiB';
const CMD = `df -B${UNIT}`;
const MOUNT = '/';

const removeValueUnit = value => Number(value.replace(UNIT, ''));

export default {
    name: getCurrentFilename(import.meta.url),
    help: 'Filesystem',
    labelNames: ['type'],

    async collect(ctx) {
        ctx.reset();

        const stdout = await run(CMD);
        const table = stdout.split('\n');

        table.forEach(row => {
            const cells = row.split(/\s+/);

            if (cells[5] === MOUNT) {
                const total = removeValueUnit(cells[1]);
                const available = removeValueUnit(cells[3]);

                ctx.labels('total').set(total);
                ctx.labels('used').set(total - available);
            }
        });
    },
};
