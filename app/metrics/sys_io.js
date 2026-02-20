import {getCurrentFilename} from '../helpers/paths.js';
import {run} from '../helpers/shell.js';

const CMD = 'iostat';

export default {
    name: getCurrentFilename(import.meta.url),
    help: CMD,
    labelNames: ['name', 'type'],

    async collect(ctx) {
        ctx.reset();

        const stdout = await run(CMD);

        const table = stdout
            .split('\n')
            .filter(Boolean)
            .slice(4)
            .map(elem => elem.split(/\s+/));

        table.forEach(elem => {
            ctx.labels(elem[0], 'read').set(Number(elem[5]));
            ctx.labels(elem[0], 'write').set(Number(elem[6]));
        });
    },
};
