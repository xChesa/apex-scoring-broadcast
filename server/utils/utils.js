
const defaultChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
function randomString(length, chars = defaultChars) {
    return new Array(length).fill("").map(() => chars.charAt(Math.floor(Math.random() * chars.length))).join();
}

module.exports = {
    randomString,
}