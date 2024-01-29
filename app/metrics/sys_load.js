import os from 'node:os';

import {getCurrentFilename} from '../helpers/paths.js';

export default {
    name: getCurrentFilename(import.meta.url),
    help: 'os.loadavg',
    labelNames: ['type'],

    collect(ctx) {
        ctx.reset();

        const labels = ['1m', '5m', '15m'];
        const load = os.loadavg();

        labels.forEach((label, i) => {
            ctx.labels(label).set(load[i]);
        });
    },
};
