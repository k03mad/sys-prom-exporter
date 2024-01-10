import {getCurrentFilename} from '../helpers/paths.js';
import {run} from '../helpers/shell.js';

const CMD = 'uptime -p';
const re = /^up\s+/;

export default {
    name: getCurrentFilename(import.meta.url),
    help: 'Uptime',
    labelNames: ['value'],

    async collect(ctx) {
        ctx.reset();

        const stdout = await run(CMD);
        ctx.labels(stdout.replace(re, '')).set(1);
    },
};
