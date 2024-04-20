import {getCurrentFilename} from '../helpers/paths.js';
import {run} from '../helpers/shell.js';

const CMD = 'sudo apt-get update && sudo apt-get upgrade -u -s';
const FIND_STARTS = 'Inst';

const RUN_ONLY_EVERY_MS = 3_600_000;
let timestamp;

export default {
    name: getCurrentFilename(import.meta.url),
    help: CMD,
    labelNames: ['name'],

    async collect(ctx) {
        if (
            !timestamp
            || (Date.now() - timestamp) > RUN_ONLY_EVERY_MS
        ) {
            timestamp = Date.now();
            ctx.reset();

            const stdout = await run(CMD);

            const updates = stdout
                .split('\n')
                .filter(el => el.startsWith(FIND_STARTS))
                .length;

            ctx.labels('updates').set(updates);
        }
    },
};
