import {getCurrentFilename} from '../helpers/paths.js';
import {run} from '../helpers/shell.js';

const UNIT = 'KiB';

const CMD = `df -B${UNIT}`;

export default {
    name: getCurrentFilename(import.meta.url),
    help: 'Filesystem',
    labelNames: [
        'type',
        'unit',
        'mounted',
        'filesystem',
    ],

    async collect(ctx) {
        ctx.reset();

        const {stdout} = await run(CMD);

        const table = stdout.trim().split('\n');
        const headers = table.shift().split(/\s+/);

        table.forEach(row => {
            const data = {};

            row.split(/\s+/).forEach((cell, i) => {
                data[headers[i].toLowerCase()] = cell;
            });

            ctx.labels('total', UNIT, data.mounted, data.filesystem).set(Number(data['1kib-blocks'].replace(UNIT, '')));
            ctx.labels('used', UNIT, data.mounted, data.filesystem).set(Number(data.used.replace(UNIT, '')));
            ctx.labels('available', UNIT, data.mounted, data.filesystem).set(Number(data.available.replace(UNIT, '')));
            ctx.labels('use%', UNIT, data.mounted, data.filesystem).set(Number(data['use%'].replace('%', '')));
        });
    },
};
