import {getCurrentFilename} from '../helpers/paths.js';
import {pathByPid, run} from '../helpers/shell.js';

const CMD = 'sudo ss -lntp';
const RE = /[\d*\]]:(?<port>\d+).+users:\({2}"(?<name>.+?)",pid=(?<pid>\d+)/;

export default {
    name: getCurrentFilename(import.meta.url),
    help: CMD,
    labelNames: ['type'],

    async collect(ctx) {
        ctx.reset();

        const stdout = await run(CMD);
        const table = stdout.split('\n');

        const data = await Promise.all(table.map(async (row, i) => {
            // header
            if (i > 0) {
                const {name, port, pid} = row.match(RE).groups;

                try {
                    const path = await pathByPid(pid);
                    return {name: `${path} ${name}`, port: Number(port)};
                } catch {}
            }
        }));

        const names = [];
        let currentPort;

        data.filter(Boolean).toSorted((a, b) => a.port - b.port).forEach(elem => {
            if (elem.port !== currentPort) {
                const label = names.includes(elem.name)
                    ? `${elem.name} (${names.filter(name => name === elem.name).length + 1})`
                    : elem.name;

                names.push(elem.name);
                currentPort = elem.port;

                ctx.labels(label).set(elem.port);
            }
        });
    },
};
