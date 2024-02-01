import {ip2geo} from '@k03mad/ip2geo';

import env from '../../env.js';
import {countDupsBy} from '../helpers/object.js';
import {getCurrentFilename} from '../helpers/paths.js';
import {run} from '../helpers/shell.js';

const CMD = 'fail2ban-client status';

const RE = {
    jails: /(\w+)(,|$)/g,
    stats: /Currently\s+failed:\s+(?<currentlyFailed>\d+)[\S\s]+Total\s+failed:\s+(?<totalFailed>\d+)[\S\s]+Currently\s+banned:\s+(?<currentlyBanned>\d+)[\S\s]+Total\s+banned:\s+(?<totalBanned>\d+)[\S\s]+Banned\s+IP\s+list:(\s+)?(?<ips>[\d .]+)?/,
};

export default {
    name: getCurrentFilename(import.meta.url),
    help: CMD,
    labelNames: [
        'name',
        'type',
    ],

    async collect(ctx) {
        ctx.reset();

        const stdout = await run(CMD);
        const jails = [...stdout.matchAll(RE.jails)].map(elem => elem[1]);

        const countries = {};
        const isps = {};

        await Promise.all(jails.map(async jail => {
            const status = await run(`${CMD} ${jail}`);
            const stats = Object.entries(status.match(RE.stats).groups);

            await Promise.all(stats.map(async ([name, value]) => {
                if (name === 'ips') {
                    if (value) {
                        const ips = value.split(/\s+/);

                        await Promise.all(ips.map(async ip => {
                            const {country, countryEmoji = '', connectionIsp} = await ip2geo({
                                ip,
                                cacheDir: env.geoip.cacheDir,
                            });

                            countDupsBy(`${countryEmoji} ${country}`.trim(), countries);
                            countDupsBy(connectionIsp, isps);
                        }));
                    }
                } else {
                    ctx.labels(name, jail).set(Number(value));
                }
            }));
        }));

        Object.entries(countries).forEach(([type, count]) => {
            ctx.labels('geoip_country', type).set(count);
        });

        Object.entries(isps).forEach(([type, count]) => {
            ctx.labels('geoip_isp', type).set(count);
        });
    },
};
