import {getCurrentFilename} from '../helpers/paths.js';
import {run} from '../helpers/shell.js';

const CMD = 'top -n 1 -b -i';
const RE = /([\d,]+\s+[a-z]{2})(,|\n)/g;

const usageNameMap = {
    us: 'User',
    sy: 'System',
    ni: 'Nice',
    id: 'Idle',
    wa: 'IoWait',
    hi: 'HardIrq',
    si: 'SoftIrq',
    st: 'Steal',
};

export default {
    name: getCurrentFilename(import.meta.url),
    help: CMD,
    labelNames: ['type'],

    async collect(ctx) {
        ctx.reset();

        const stdout = await run(CMD);

        const usage = [...stdout.matchAll(RE)].map(elem => {
            const splitted = elem[1].split(' ');
            return {
                num: Number(splitted[0].replace(',', '.')),
                type: usageNameMap[splitted[1]],
            };
        });

        usage.forEach(({type, num}) => {
            ctx.labels(type).set(num);
        });
    },
};
