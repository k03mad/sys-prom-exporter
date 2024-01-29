import os from 'node:os';

import {getCurrentFilename} from '../helpers/paths.js';

const labels = ['1m', '5m', '15m'];

export default {
    name: getCurrentFilename(import.meta.url),
    help: 'os.loadavg',
    labelNames: ['type'],

    collect(ctx) {
        ctx.reset();

        const load = os.loadavg();

        labels.forEach((label, i) => {
            ctx.labels(label).set(load[i]);
        });
    },
};
