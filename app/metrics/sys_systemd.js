import {countDupsBy} from '../helpers/object.js';
import {getCurrentFilename} from '../helpers/paths.js';
import {run} from '../helpers/shell.js';

const CMD = 'systemctl list-units --all';
const CMD_FAILED = 'systemctl list-units --failed';

const FIND_INCLUDES = '.';

export default {
    name: getCurrentFilename(import.meta.url),
    help: CMD,
    labelNames: ['name', 'type'],

    async collect(ctx) {
        ctx.reset();

        const [stdout, stdoutFailed] = await Promise.all([run(CMD), run(CMD_FAILED)]);

        const table = stdout.split('\n');
        const tableFailed = stdoutFailed.split('\n');

        const counters = {};

        table.forEach((row, i) => {
            // header
            if (i > 0) {
                const cells = row.split(/\s+/);

                const service = cells[1];
                const status = cells[3];

                if (service?.includes(FIND_INCLUDES)) {
                    countDupsBy(status, counters);
                }
            }
        });

        tableFailed.forEach((row, i) => {
            // header
            if (i > 0) {
                const cells = row.split(/\s+/);
                const service = cells[1];

                if (service?.includes(FIND_INCLUDES)) {
                    ctx.labels('failed', service).set(1);
                }
            }
        });

        Object.entries(counters).forEach(([type, value]) => {
            ctx.labels('count', type).set(value);
        });
    },
};
