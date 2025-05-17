const roles = Object.freeze({
    guest: null,
    user: ['guest'],
    admin: ['user']
})

module.exports = roles