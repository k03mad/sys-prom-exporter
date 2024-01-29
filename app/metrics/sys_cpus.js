import os from 'node:os';

import {getCurrentFilename} from '../helpers/paths.js';

export default {
    name: getCurrentFilename(import.meta.url),
    help: 'os.cpus',
    labelNames: [
        'name',
        'type',
    ],

    collect(ctx) {
        ctx.reset();

        const cpus = os.cpus();

        cpus.forEach((cpu, i) => {
            Object.entries(cpu.times).forEach(([type, value]) => {
                ctx.labels(`cpu${i}`, type).set(value);
            });
        });
    },
};
