import { Snowflake } from 'discord.js';
import passport from 'passport'
import DiscordStrategy from 'passport-discord'
import { OAuth2CredentialsModel } from '../../database/schemas/OAuth2Credentials';

import { UserModel } from '../../database/schemas/User';
import { encrypt } from '../utils/utils';

passport.serializeUser((user, done) => {
    done(null, user.discordId)
});

passport.deserializeUser(async (discordId: Snowflake, done) => {
    try {
        const user = await UserModel.findOne({ discordId });
        return user ? done(null, user) : done(null, null);
    } catch(err) {
        done(err, null);
    }
})

passport.use(new DiscordStrategy({
    clientID: process.env.DISCORD_CLIENT_ID!,
    clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    callbackURL: process.env.DISCORD_CALLBACK_URL!,
    scope: ['identify', 'guilds'],
}, async(accessToken, refreshToken, profile, done) => {

    const encryptedAccessToken = encrypt(accessToken).toString();
    const encryptedRefreshToken = encrypt(refreshToken).toString();
    const { id, username, discriminator, avatar } = profile;
    try {
        const findUser = await UserModel.findOneAndUpdate({ discordId: id }, {
            discordTag: `${username}#${Number(discriminator)}`,
            avatar,
        }, {new: true});

        const findCredentials = await OAuth2CredentialsModel.findOneAndUpdate({ discordId: id }, {
            accessToken: encryptedAccessToken,
            refreshToken: encryptedRefreshToken,
        });
    
        if(findUser) {
            if(!findCredentials) {
                await OAuth2CredentialsModel.create({
                    accessToken: encryptedAccessToken,
                    refreshToken: encryptedRefreshToken,
                    discordId: id,
                });
            }
            return done(null, findUser);
        } else {
            const newUser = await UserModel.create({
                discordId: id,
                discordTag: `${username}#${discriminator}`,
                avatar
            });
            await OAuth2CredentialsModel.create({
                accessToken: encryptedAccessToken,
                refreshToken: encryptedRefreshToken,
                discordId: id,
            });
            return done(null, newUser);
        }
    } catch(err: any) {
        return done(err, undefined);
    }
}));