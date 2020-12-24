import React from 'react';
import { updateGuildConfig } from '../../utils/api';
import { GuildConfigForm } from '../../components';
import { useMutation, useQuery } from '@apollo/client';
import { dashboardPageQuery } from '../../graphql/queries';
import { updateGuildConfigMutation } from '../../graphql/mutations';

export function DashboardPage({history, match}) {

    const {loading, error, data} = useQuery(dashboardPageQuery, {variables: {guildID: match.params.id}});
    const [updateConfig] = useMutation(updateGuildConfigMutation);

    const updateGuildConfigParent = async (config) => {
        try {
            updateConfig({
                variables: {
                    guildID: match.params.id,
                    prefix: config.prefix
                }
            });
        } catch(err) {
            console.log(err);
        }
    }

    if(!loading && !error) {
        const {getUser, getGuildConfig} = data;
        return (
            <div>
                <h1>DashboardPage</h1>
                <GuildConfigForm user={getUser} config={getGuildConfig} updateConfig={updateGuildConfigParent} />
            </div>
        )
    } return <h1>Loading...</h1>
}