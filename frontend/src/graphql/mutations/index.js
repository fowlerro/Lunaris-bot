import {gql} from '@apollo/client';

export const updateGuildConfigMutation = gql`
    mutation UpdateGuildConfig($guildID: String!, $prefix: String) {
        updateGuildConfig(guildID: $guildID, prefix: $prefix) {
            guildID
            prefix
        }
    }
`;