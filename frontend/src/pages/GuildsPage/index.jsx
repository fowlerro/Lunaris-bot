import React from 'react';
import { GuildMenu, GuildInvite } from '../../components';
import { getGuilds, getUserDetails } from '../../utils/api';

export function GuildsPage({history, }) {

    const [user, setUser] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [guilds, setGuilds] = React.useState({});

    React.useEffect(() => {
        getUserDetails().then(({data}) => {
            setUser(data);
            return getGuilds();
        }).then(({data}) => {
            setGuilds(data);
            setLoading(false);
        }).catch((err) => {
            history.push('/');
            setLoading(false);
        });
    }, [])

    return !loading && (
        <>
            <div>
                <GuildMenu guilds={guilds.included} />
                <GuildInvite guilds={guilds.excluded} />
            </div>
        </>
    ) 
}