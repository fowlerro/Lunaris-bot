import React from 'react';
import { GuildsComponent } from '../../components';
import { getGuilds, getUserDetails } from '../../utils/api';

export function GuildsPage({history, }) {

    const [user, setUser] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [guilds, setGuilds] = React.useState([]);

    React.useEffect(() => {
        getUserDetails().then(({data}) => {
            setUser(data);
            setLoading(false);
            return getGuilds();
        }).then(({data}) => {
            setGuilds(data);
        }).catch((err) => {
            history.push('/');
            setLoading(false);
        });
    }, [])

    return !loading && (
        <>
            <div>
                <GuildsComponent guilds={guilds} />
            </div>
        </>
    ) 
}