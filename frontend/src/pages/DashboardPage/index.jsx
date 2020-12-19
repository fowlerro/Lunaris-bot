import React from 'react';
import { getGuildConfig, getUserDetails, updateGuildConfig } from '../../utils/api';
import { GuildConfigForm } from '../../components';

export function DashboardPage({history, match}) {

    const [user, setUser] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [config, setConfig] = React.useState({});

    React.useEffect(() => {
        getUserDetails().then(({data}) => {
            setUser(data);
            return getGuildConfig(match.params.id);
        }).then(({data}) => {
            setConfig(data);
            setLoading(false);
        }).catch((err) => {
            history.push('/');
            setLoading(false);
        });
    }, [])

    const updateGuildConfigParent = async (config) => {
        try {
            const update = await updateGuildConfig(match.params.id, config);
        } catch(err) {
            console.log(err);
        }

    }

    return !loading && (
        <div>
            <h1>DashboardPage</h1>
            <GuildConfigForm user={user} config={config} updateConfig={updateGuildConfigParent} />
        </div>
    )
}