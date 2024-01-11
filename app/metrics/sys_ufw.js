import {getCurrentFilename} from '../helpers/paths.js';
import {run} from '../helpers/shell.js';

const CMD = 'ufw status numbered';
const RE = /\[\s*(\d+)](\s{2,})?/;

export default {
    name: getCurrentFilename(import.meta.url),
    help: CMD,
    labelNames: [
        'num',
        'port',
        'rule',
        'ip',
        'comment',
    ],

    async collect(ctx) {
        ctx.reset();

        const stdout = await run(CMD);
        const table = stdout.split('\n');

        table.forEach((row, i) => {
            // headers
            if (i >= 4) {
                const [num, port, rule1, rule2, ip, ...comment] = row.replace(RE, '$1').split(/\s+/);
                ctx.labels(num, port, `${rule1} ${rule2}`, ip, comment.join(' ')).set(1);
            }
        });
    },
};
