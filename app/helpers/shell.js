import cp from 'node:child_process';
import {promisify} from 'node:util';

import _debug from 'debug';

const debug = _debug('mad:shell');
const exec = promisify(cp.exec);

/**
 * @param {string} runString
 * @returns {Promise<{stdout: string, stderr: string}>}
 */
export const run = async runString => {
    debug(runString);

    const {stdout} = await exec(runString, {shell: '/bin/bash'});
    return stdout?.trim();
};

/**
 * @param {string|number} pid
 * @returns {Promise<string>}
 */
export const pathByPid = async pid => {
    const stdout = await run(`pwdx ${pid}`);
    return stdout.replace(/^\d+:\s+/, '');
};
