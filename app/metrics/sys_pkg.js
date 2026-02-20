import {getCurrentFilename} from '../helpers/paths.js';
import {run} from '../helpers/shell.js';

const CMD = 'dpkg-query -l';
const FIND_STARTS = 'ii';

export default {
    name: getCurrentFilename(import.meta.url),
    help: CMD,
    labelNames: ['name'],

    async collect(ctx) {
        ctx.reset();

        const stdout = await run(CMD);

        const packages = stdout.split('\n').filter(elem => elem.startsWith(FIND_STARTS)).length;

        ctx.labels('count').set(packages);
    },
};
