import {getCurrentFilename} from '../helpers/paths.js';
import {run} from '../helpers/shell.js';

const CMD = 'sudo apt-get update && sudo apt-get upgrade -u -s';
const FIND_STARTS = 'Inst';

const RUN_ONLY_EVERY_MINUTES = 360;

let timestamp = Date.now();

export default {
    name: getCurrentFilename(import.meta.url),
    help: CMD,
    labelNames: ['name'],

    async collect(ctx) {
        if (((Date.now() - timestamp) / 60_000) > RUN_ONLY_EVERY_MINUTES) {
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
