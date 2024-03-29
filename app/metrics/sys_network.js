import {getCurrentFilename} from '../helpers/paths.js';
import {run} from '../helpers/shell.js';

const CMD = 'ifconfig';

const RE = {
    iface: /^(\w+):/,
    bytes: /bytes (\d+)/g,
};

export default {
    name: getCurrentFilename(import.meta.url),
    help: CMD,
    labelNames: ['type'],

    async collect(ctx) {
        ctx.reset();

        const stdout = await run(CMD);
        const interfaces = stdout.split('\n\n');

        interfaces.forEach(iface => {
            const ifaceName = iface.match(RE.iface)[1];
            const ifaceBytes = [...iface.matchAll(RE.bytes)].map(elem => Number(elem[1]));

            ctx.labels(ifaceName).set(ifaceBytes[0] + ifaceBytes[1]);
        });
    },
};
