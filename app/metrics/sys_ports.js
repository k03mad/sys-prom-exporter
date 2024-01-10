import {getCurrentFilename} from '../helpers/paths.js';
import {pathByPid, run} from '../helpers/shell.js';

const CMD = 'ss -lntp';
const RE = /[\d*\]]:(?<port>\d+).+users:\({2}"(?<name>.+?)",pid=(?<pid>\d+)/;

export default {
    name: getCurrentFilename(import.meta.url),
    help: CMD,
    labelNames: ['name'],

    async collect(ctx) {
        ctx.reset();

        const stdout = await run(CMD);
        const table = stdout.split('\n');

        const data = await Promise.all(table.map(async (row, i) => {
            // header
            if (i > 0) {
                const {name, port, pid} = row.match(RE).groups;
                const path = await pathByPid(pid);

                return {name: `${path} ${name}`, port: Number(port)};
            }
        }));

        const names = [];
        let currentPort;

        data.sort((a, b) => a.port - b.port).forEach(elem => {
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
