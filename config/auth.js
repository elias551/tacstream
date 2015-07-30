module.exports = {
    mongo: {
        connectionString    : process.env.TACSTREAM_DB_CONNECTION_STRING,
        user                : process.env.TACSTREAM_DB_USER,
        pass                : process.env.TACSTREAM_DB_PASS
    },
    facebook: {
        clientID            : process.env.TACSTREAM_FACEBOOK_CLIENT_ID,
        clientSecret        : process.env.TACSTREAM_FACEBOOK_CLIENT_SECRET,
        callbackURL         : '/auth/facebook/callback'
    },
    google: {
        clientID            : process.env.TACSTREAM_GOOGLE_CLIENT_ID,
        clientSecret        : process.env.TACSTREAM_GOOGLE_CLIENT_SECRET,
        callbackURL         : '/auth/google/callback'
    }
};