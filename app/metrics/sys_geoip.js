import fs from 'node:fs/promises';
import path from 'node:path';

import {cacheStorage} from '@k03mad/ip2geo';

import env from '../../env.js';
import {getCurrentFilename} from '../helpers/paths.js';

export default {
    name: getCurrentFilename(import.meta.url),
    help: 'geoip lib stats',
    labelNames: ['name', 'type'],

    async collect(ctx) {
        ctx.reset();

        const cacheDir = await fs.readdir(env.geoip.cacheDir);

        let entries = 0;
        const prefixEntries = {};

        await Promise.all(cacheDir.map(async file => {
            const data = await fs.readFile(path.join(env.geoip.cacheDir, file), {encoding: 'utf8'});
            const prefixCount = data.split('\n').filter(Boolean).length;

            entries += prefixCount;
            prefixEntries[file.split('_')[0]] = prefixCount;
        }));

        ctx.labels('files', null).set(cacheDir.length);
        ctx.labels('entries', null).set(entries);
        ctx.labels('map_entries', null).set(cacheStorage.size);

        Object.entries(prefixEntries).forEach(([prefix, count]) => {
            ctx.labels('prefix_entries', prefix).set(count);
        });
    },
};
