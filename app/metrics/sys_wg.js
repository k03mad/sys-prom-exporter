import {getCurrentFilename} from '../helpers/paths.js';
import {run} from '../helpers/shell.js';

const IMAGES = {
    // awg: 'amnezia-awg',
    // awg2: 'amnezia-awg2',
    wg: 'amnezia-wireguard',
};

const exec = image => `docker exec ${image} wg show all dump`;

export default {
    name: getCurrentFilename(import.meta.url),
    help: Object.values(IMAGES).join(' / '),
    labelNames: ['type'],

    async collect(ctx) {
        ctx.reset();

        const data = await Promise.all(
            Object.entries(IMAGES).map(async ([key, value]) => {
                try {
                    const dump = await run(exec(value));
                    return {key, dump};
                } catch {}
            }),
        );

        data.filter(Boolean).forEach(({key, dump}) => {
            dump.split('\n').forEach((row, i) => {
                if (i > 0) {
                    const cells = row.split(/\s+/);
                    const ip = cells[4];

                    if (/^\d/.test(ip)) {
                        ctx.labels(`${key} | ${cells[4]}`).set(Number(cells[6]) + Number(cells[7]));
                    }
                }
            });
        });
    },
};
