import {getCurrentFilename} from '../helpers/paths.js';
import {run} from '../helpers/shell.js';

const CMD = 'fail2ban-client status';

const RE = {
    jails: /(\w+)(,|$)/g,
    stats: /Currently\s+failed:\s+(?<currentlyFailed>\d+)[\S\s]+Total\s+failed:\s+(?<totalFailed>\d+)[\S\s]+Currently\s+banned:\s+(?<currentlyBanned>\d+)[\S\s]+Total\s+banned:\s+(?<totalBanned>\d+)/,
};

export default {
    name: getCurrentFilename(import.meta.url),
    help: CMD,
    labelNames: ['name', 'type'],

    async collect(ctx) {
        ctx.reset();

        const stdout = await run(CMD);
        const jails = [...stdout.matchAll(RE.jails)].map(elem => elem[1]);

        await Promise.all(
            jails.map(async jail => {
                const status = await run(`${CMD} ${jail}`);
                const stats = Object.entries(status.match(RE.stats).groups);

                stats.forEach(([name, value]) => {
                    ctx.labels(name, jail).set(Number(value));
                });
            }),
        );
    },
};
