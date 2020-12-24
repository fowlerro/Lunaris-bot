const passport = require('passport');
const DiscordStrategy = require('passport-discord');
const OAuth2Credentials = require('../database/schemas/OAuth2Credentials');
const User = require('../database/schemas/User');
const { encrypt } = require('../utils/utils');
const infoLog = 'PassportLOG -> ';

passport.serializeUser((user, done) => {
    done(null, user.discordID)
});

passport.deserializeUser(async (discordID, done) => {
    try {
        const user = await User.findOne({discordID});
        return user ? done(null, user) : done(null, null);
    } catch(err) {
        console.log(infoLog + 'Error: ' + err + ' || src/strategies/discord.js');
        done(err, null);
    }
})

passport.use(new DiscordStrategy({
    clientID: process.env.DASHBOARD_CLIENT_ID,
    clientSecret: process.env.DASHBOARD_CLIENT_SECRET,
    callbackURL: process.env.DASHBOARD_CALLBACK_URL,
    scope: ['identify', 'guilds'],
}, async(accessToken, refreshToken, profile, done) => {

    const encryptedAccessToken = encrypt(accessToken).toString();
    const encryptedRefreshToken = encrypt(refreshToken).toString();
    const {id, username, discriminator, avatar, guilds} = profile;
    try {
        const findUser = await User.findOneAndUpdate({discordID: id}, {
            discordTag: `${username}#${discriminator}`,
            avatar,
        }, {new: true});

        const findCredentials = await OAuth2Credentials.findOneAndUpdate({discordID: id}, {
            accessToken: encryptedAccessToken,
            refreshToken: encryptedRefreshToken,
        });
    
        if(findUser) {
            if(!findCredentials) {
                const newCredentials = await OAuth2Credentials.create({
                    accessToken: encryptedAccessToken,
                    refreshToken: encryptedRefreshToken,
                    discordID: id,
                });
            }
            return done(null, findUser);
        } else {
            const newUser = await User.create({
                discordID: id,
                discordTag: `${username}#${discriminator}`,
                avatar
            });
            const newCredentials = await OAuth2Credentials.create({
                accessToken: encryptedAccessToken,
                refreshToken: encryptedRefreshToken,
                discordID: id,
            });
            return done(null, newUser);
        }
    } catch(err) {
        console.log(infoLog + 'Error: ' + err + ' || src/strategies/discord.js');
        return done(err, null);
    }
}));