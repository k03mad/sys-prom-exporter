import {getCurrentFilename} from '../helpers/paths.js';
import {run} from '../helpers/shell.js';

const CMD = 'apt-get update && apt-get upgrade -u -s';
const re = /^Inst/;

const RUN_ONLY_EVERY_MS = 3_600_000;
let timestamp;

export default {
    name: getCurrentFilename(import.meta.url),
    help: 'APT',
    labelNames: ['type'],

    async collect(ctx) {
        if (
            !timestamp
            || (Date.now() - timestamp) > RUN_ONLY_EVERY_MS
        ) {
            ctx.reset();

            const stdout = await run(CMD);

            const updates = stdout
                .split('\n')
                .filter(el => re.test(el))
                .length;

            ctx.labels('updates').set(updates);

            timestamp = Date.now();
        }
    },
};
