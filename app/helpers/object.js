/**
 * @param {object} obj
 * @param {string} key
 * @param {string|number} count
 */
export const countDups = (obj, key, count = 1) => {
    obj[key] = obj[key] ? obj[key] + Number(count) : Number(count);
};
