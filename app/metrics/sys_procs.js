import {getCurrentFilename} from '../helpers/paths.js';
import {pathByPid, run} from '../helpers/shell.js';

const CMD = 'ps -eo pid,pcpu,pmem,comm';

export default {
    name: getCurrentFilename(import.meta.url),
    help: CMD,
    labelNames: ['name', 'type'],

    async collect(ctx) {
        ctx.reset();

        const stdout = await run(CMD);
        const table = stdout.split('\n');

        const data = await Promise.all(
            table.map(async row => {
                const [pid, cpu, mem, ...proc] = row.split(/\s+/).filter(Boolean);

                const cpuNum = Number(cpu);
                const memNum = Number(mem);

                if (cpuNum > 0 || memNum > 0) {
                    const name = proc.join(' ').trim();

                    try {
                        const path = await pathByPid(pid);
                        return {name: `${path} ${name}`, cpu: cpuNum, mem: memNum};
                    } catch {}
                }
            }),
        );

        const metricsCpu = {};
        const metricsMem = {};

        data.filter(Boolean).forEach(elem => {
            if (metricsCpu[elem.name]) {
                metricsCpu[elem.name] += elem.cpu;
            } else {
                metricsCpu[elem.name] = elem.cpu;
            }

            if (metricsMem[elem.name]) {
                metricsMem[elem.name] += elem.mem;
            } else {
                metricsMem[elem.name] = elem.mem;
            }
        });

        Object.entries(metricsCpu).forEach(([type, value]) => {
            ctx.labels('cpu', type).set(value);
        });

        Object.entries(metricsMem).forEach(([type, value]) => {
            ctx.labels('mem', type).set(value);
        });

        ctx.labels('count', null).set(table.length - 1);
    },
};
