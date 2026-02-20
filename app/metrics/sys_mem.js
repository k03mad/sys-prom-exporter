import {getCurrentFilename} from '../helpers/paths.js';
import {run} from '../helpers/shell.js';

const CMD = 'cat /proc/meminfo';

export default {
    name: getCurrentFilename(import.meta.url),
    help: CMD,
    labelNames: ['type'],

    async collect(ctx) {
        ctx.reset();

        const stdout = await run(CMD);
        const table = stdout.split('\n');

        const data = {};

        table.forEach(row => {
            const cells = row.split(/\s+/);
            data[cells[0].replace(':', '')] = Number(cells[1]);
        });

        ctx.labels('MemFree').set(data.MemFree);
        ctx.labels('MemTotal').set(data.MemTotal);
        ctx.labels('MemUsed').set(data.MemTotal - data.MemAvailable);

        ctx.labels('SwapCached').set(data.SwapCached);
        ctx.labels('SwapTotal').set(data.SwapTotal);
        ctx.labels('SwapUsed').set(data.SwapTotal - data.SwapFree);

        ctx.labels('Buffers').set(data.Buffers);
        ctx.labels('Cached').set(data.Cached);
        ctx.labels('HardwareCorrupted').set(data.HardwareCorrupted || 0);
        ctx.labels('PageTables').set(data.PageTables);
        ctx.labels('Slab').set(data.Slab);

        ctx.labels('Apps').set(
            data.MemTotal -
                data.MemFree -
                data.Buffers -
                data.Cached -
                data.Slab -
                data.PageTables -
                data.SwapCached,
        );
    },
};
