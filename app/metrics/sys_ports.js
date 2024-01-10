import {getCurrentFilename} from '../helpers/paths.js';
import {run} from '../helpers/shell.js';

const CMD = 'ss -lntp';
const RE = /[\d*\]]:(?<port>\d+).+users:\({2}"(?<name>.+?)"/;

export default {
    name: getCurrentFilename(import.meta.url),
    help: CMD,
    labelNames: ['name'],

    async collect(ctx) {
        ctx.reset();

        const stdout = await run(CMD);
        const table = stdout.split('\n');

        table.forEach((row, i) => {
            // header
            if (i > 0) {
                const {name, port} = row.match(RE).groups;
                ctx.labels(name).set(Number(port));
            }
        });
    },
};
