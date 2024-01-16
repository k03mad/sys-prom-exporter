import fs from 'node:fs/promises';
import path from 'node:path';

import env from '../../env.js';
import {getCurrentFilename} from '../helpers/paths.js';

export default {
    name: getCurrentFilename(import.meta.url),
    help: 'geoip lib stats',
    labelNames: ['type'],

    async collect(ctx) {
        ctx.reset();

        const cacheDir = await fs.readdir(env.geoip.cacheDir);
        ctx.labels('files').set(cacheDir.length);

        let entries = 0;

        await Promise.all(cacheDir.map(async file => {
            const data = await fs.readFile(path.join(env.geoip.cacheDir, file), {encoding: 'utf8'});
            entries += data.split('\n').filter(Boolean).length;
        }));

        ctx.labels('entries').set(entries);
    },
};
