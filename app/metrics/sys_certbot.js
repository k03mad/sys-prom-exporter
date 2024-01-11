import {getCurrentFilename} from '../helpers/paths.js';
import {run} from '../helpers/shell.js';

const CMD = 'certbot certificates';

const RE = {
    domains: /Domains: (.+)/g,
    valid: /VALID: (\d+)/g,
};

export default {
    name: getCurrentFilename(import.meta.url),
    help: CMD,
    labelNames: ['type'],

    async collect(ctx) {
        ctx.reset();

        const stdout = await run(CMD);

        const domains = [...stdout.matchAll(RE.domains)].map(elem => elem[1]);
        const valid = [...stdout.matchAll(RE.valid)].map(elem => Number(elem[1]));

        domains.forEach((domain, i) => {
            ctx.labels(domain).set(valid[i]);
        });
    },
};
