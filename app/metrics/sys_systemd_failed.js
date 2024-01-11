import {getCurrentFilename} from '../helpers/paths.js';
import {run} from '../helpers/shell.js';

const CMD = 'systemctl list-units --failed';
const FIND_INCLUDES = '.';

export default {
    name: getCurrentFilename(import.meta.url),
    help: CMD,
    labelNames: ['type'],

    async collect(ctx) {
        ctx.reset();

        const stdout = await run(CMD);
        const table = stdout.split('\n');

        table.forEach((row, i) => {
            // header
            if (i > 0) {
                const cells = row.split(/\s+/);
                const service = cells[1];

                if (service?.includes(FIND_INCLUDES)) {
                    ctx.labels(service).set(1);
                }
            }
        });
    },
};
