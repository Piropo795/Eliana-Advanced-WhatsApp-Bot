module.exports = {
    name: 'auth_failure',
    once: false,
    execute(msg) {
        console.error('Authentication failed:', msg);
    },
};

