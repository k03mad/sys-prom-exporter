import {IPWhois} from '@k03mad/dns-leak';

import {countDups} from '../helpers/object.js';
import {getCurrentFilename} from '../helpers/paths.js';
import {run} from '../helpers/shell.js';

const whois = new IPWhois({ipRequestsCacheExpireSec: Number.POSITIVE_INFINITY});

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
                            const ipInfo = await whois.getIpInfo({ip});

                            if (ipInfo.country) {
                                countDups(countries, `${ipInfo.flag?.emoji || ''} ${ipInfo.country}`.trim());
                            }

                            if (ipInfo.connection?.isp) {
                                countDups(isps, ipInfo.connection.isp);
                            }
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
