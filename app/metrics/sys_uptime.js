import os from 'node:os';

import {getCurrentFilename} from '../helpers/paths.js';

export default {
    name: getCurrentFilename(import.meta.url),
    help: 'os.uptime',
    labelNames: ['type'],

    collect(ctx) {
        ctx.reset();
        ctx.labels('uptime').set(os.uptime());
    },
};
