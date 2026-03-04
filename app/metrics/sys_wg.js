import fs from 'node:fs/promises';
import path from 'node:path';

import {getCurrentFilename} from '../helpers/paths.js';
import {run} from '../helpers/shell.js';

const IMAGES = {
    awg: 'amnezia-awg',
    wg: 'amnezia-wireguard',
};

const exec = image => `docker exec ${image} wg show all dump`;

export default {
    name: getCurrentFilename(import.meta.url),
    help: Object.values(IMAGES).join(' / '),
    labelNames: ['type'],

    async collect(ctx) {
        ctx.reset();

        let users;

        try {
            const wg = await fs.readFile(path.join(process.cwd(), 'wg.json'));
            users = JSON.parse(wg);
        } catch {}

        const data = await Promise.all(
            Object.entries(IMAGES).map(async ([key, value]) => {
                const dump = await run(exec(value));
                return {key, dump};
            }),
        );

        data.forEach(({key, dump}) => {
            dump.split('\n').forEach((row, i) => {
                if (i > 0) {
                    const cells = row.split(/\s+/);
                    const ip = cells[4];

                    if (/^\d/.test(ip)) {
                        const label = `${key} | ${cells[4]}`;
                        ctx.labels(users[label] || label).set(Number(cells[6]) + Number(cells[7]));
                    }
                }
            });
        });
    },
};
