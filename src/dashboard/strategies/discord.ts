import passport from 'passport'
import { Strategy } from 'passport-discord'

import { UserModel } from '../../database/schemas/User';
import { encrypt } from '../utils/utils';

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id: string, done) => {
    try {
        const user = await UserModel.findById(id)
        return user ? done(null, user) : done(null, null);
    } catch(err: any) {
        logger.error(err)
        done(err, null);
    }
})

passport.use(new Strategy({
    clientID: process.env.DISCORD_CLIENT_ID!,
    clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    callbackURL: process.env.DISCORD_CALLBACK_URL!,
    scope: ['identify', 'guilds'],
}, async(accessToken, refreshToken, profile, done) => {
    const encryptedAccessToken = encrypt(accessToken).toString();
    const encryptedRefreshToken = encrypt(refreshToken).toString();
    const { id } = profile;
    try {
        const findedUser = await UserModel.findOneAndUpdate({ discordId: id }, {
            accessToken: encryptedAccessToken,
            refreshToken: encryptedRefreshToken,
        }, { new: true });
        if(findedUser) return done(null, findedUser);

        const newUser = await UserModel.create({
            discordId: id,
            accessToken: encryptedAccessToken,
            refreshToken: encryptedRefreshToken,
        });
        return done(null, newUser);
    } catch(err: any) {
        logger.error(err)
        return done(err, undefined);
    }
}));