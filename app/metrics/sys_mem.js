import {getCurrentFilename} from '../helpers/paths.js';
import {run} from '../helpers/shell.js';

export default {
    name: getCurrentFilename(import.meta.url),
    help: 'Portfolios',
    labelNames: [
        'account',
        'type',
    ],

    async collect(ctx) {
        ctx.reset();

        const {stdout} = await run('free -b');
    },
};
