import {getCurrentFilename} from '../helpers/paths.js';
import {run} from '../helpers/shell.js';

const CMD = 'uptime -p';

export default {
    name: getCurrentFilename(import.meta.url),
    help: 'Uptime',
    labelNames: ['value'],

    async collect(ctx) {
        ctx.reset();

        const stdout = await run(CMD);
        ctx.labels(stdout.replace('up ', '')).set(1);
    },
};
