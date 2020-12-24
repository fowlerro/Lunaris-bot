import { useQuery } from '@apollo/client';
import React from 'react';
import { GuildMenu, GuildInvite } from '../../components';
import { guildsPageQuery } from '../../graphql/queries';

export function GuildsPage({history, }) {


    const {loading, error, data} = useQuery(guildsPageQuery);

    if(!loading && !error) {
        const {getMutualGuilds} = data;
        return (
            <div>
                <GuildMenu guilds={getMutualGuilds.included} />
                <GuildInvite guilds={getMutualGuilds.excluded} />
            </div>
        )
    } return <h1>Loading...</h1>
}