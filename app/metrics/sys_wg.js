import {getCurrentFilename} from '../helpers/paths.js';
import {run} from '../helpers/shell.js';

const CMD = 'wg show all dump';
const CMD_CONF = 'cat /etc/wireguard/wg0.conf';

const FIND_STARTS_CLIENT = '### Client ';
const FIND_STARTS_KEY = 'PublicKey = ';

export default {
    name: getCurrentFilename(import.meta.url),
    help: CMD,
    labelNames: ['type'],

    async collect(ctx) {
        ctx.reset();

        const [config, dump] = await Promise.all([run(CMD_CONF), run(CMD)]);

        const configTable = config.split('\n');
        const dumpTable = dump.split('\n');

        const clients = {};
        let client;

        configTable.forEach(row => {
            if (row.startsWith(FIND_STARTS_CLIENT)) {
                client = row.split(FIND_STARTS_CLIENT)[1];
            }

            if (row.startsWith(FIND_STARTS_KEY)) {
                const key = row.split(FIND_STARTS_KEY)[1];
                clients[key] = client;
            }
        });

        dumpTable.forEach(row => {
            const cells = row.split(/\s+/);
            const clientName = clients[cells[1]];

            if (clientName) {
                ctx.labels(clientName).set(Number(cells[6]) + Number(cells[7]));
            }
        });
    },
};
