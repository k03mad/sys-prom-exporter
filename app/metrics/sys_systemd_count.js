import {countDups} from '../helpers/object.js';
import {getCurrentFilename} from '../helpers/paths.js';
import {run} from '../helpers/shell.js';

const CMD = 'systemctl list-units --all';
const FIND_INCLUDES = '.';

export default {
    name: getCurrentFilename(import.meta.url),
    help: CMD,
    labelNames: ['type'],

    async collect(ctx) {
        ctx.reset();

        const stdout = await run(CMD);
        const table = stdout.split('\n');

        const counters = {};

        table.forEach((row, i) => {
            // header
            if (i > 0) {
                const cells = row.split(/\s+/);

                const service = cells[1];
                const status = cells[3];

                if (service?.includes(FIND_INCLUDES)) {
                    countDups(counters, status);
                }
            }
        });

        Object.entries(counters).forEach(([type, value]) => {
            ctx.labels(type).set(value);
        });
    },
};
