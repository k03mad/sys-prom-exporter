import {getCurrentFilename} from '../helpers/paths.js';
import {run} from '../helpers/shell.js';

const CMD = 'uptime -p';
const RE = /^up\s+/;

export default {
    name: getCurrentFilename(import.meta.url),
    help: CMD,
    labelNames: ['type'],

    async collect(ctx) {
        ctx.reset();

        const stdout = await run(CMD);
        ctx.labels(stdout.replace(RE, '')).set(1);
    },
};
