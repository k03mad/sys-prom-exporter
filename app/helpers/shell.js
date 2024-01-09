import cp from 'node:child_process';
import util from 'node:util';

const exec = util.promisify(cp.exec);

/**
 * @param {string} runString
 * @returns {Promise<{stdout: string, stderr: string}>}
 */
export const run = runString => exec(runString, {shell: '/bin/bash'});
