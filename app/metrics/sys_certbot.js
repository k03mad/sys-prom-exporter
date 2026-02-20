import {getCurrentFilename} from '../helpers/paths.js';
import {run} from '../helpers/shell.js';

const CMD = 'sudo certbot certificates';

const RE = {
    domains: /Domains: (.+)/g,
    valid: /VALID: (\d+)/g,
};

const RUN_ONLY_EVERY_MINUTES = 360;

let timestamp = Date.now();

export default {
    name: getCurrentFilename(import.meta.url),
    help: CMD,
    labelNames: ['type'],

    async collect(ctx) {
        if ((Date.now() - timestamp) / 60_000 > RUN_ONLY_EVERY_MINUTES) {
            ctx.reset();

            const stdout = await run(CMD);

            const domains = [...stdout.matchAll(RE.domains)].map(elem => elem[1]);
            const valid = [...stdout.matchAll(RE.valid)].map(elem => Number(elem[1]));

            domains.forEach((domain, i) => {
                ctx.labels(domain).set(valid[i]);
            });

            timestamp = Date.now();
        }
    },
};
