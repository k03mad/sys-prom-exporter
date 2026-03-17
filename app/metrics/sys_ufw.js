import {getCurrentFilename} from '../helpers/paths.js';
import {run} from '../helpers/shell.js';

const CMD = 'ufw status numbered';
const RE = /\[\s*(\d+)](\s{2,})?/;
const V6_FLAG = '(v6)';

export default {
    name: getCurrentFilename(import.meta.url),
    help: CMD,
    labelNames: ['num', 'port', 'rule', 'ip', 'comment'],

    async collect(ctx) {
        ctx.reset();

        const stdout = await run(CMD);
        const table = stdout.split('\n');

        table.forEach((row, i) => {
            // headers
            if (i >= 4) {
                let rowArr = row.replace(RE, '$1').split(/\s+/);
                const isV6 = rowArr.includes(V6_FLAG);

                if (isV6) {
                    rowArr = rowArr.filter(elem => elem !== V6_FLAG);
                }

                const [num, port, rule1, rule2, ip, ...comment] = rowArr;

                const commentTrim =
                    comment.join(' ').trim().replace(/^#/, '').trim() + (isV6 ? ` ${V6_FLAG}` : '');

                ctx.labels(num, port, `${rule1} ${rule2}`, ip, commentTrim).set(1);
            }
        });
    },
};
