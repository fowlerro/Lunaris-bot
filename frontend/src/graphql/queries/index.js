import {gql} from '@apollo/client';

export const guildsPageQuery = gql`
    query getGuildsPageQuery {
        getUser {
            discordID
            discordTag
            avatar
        }
        getMutualGuilds {
            included {
                name
                id
            }
            excluded {
                name
                id
            }
        }
    }
`;

export const dashboardPageQuery = gql`
    query getDashboardPageQuery($guildID: String!) {
        getUser {
            discordID
            discordTag
            avatar
        }
        getGuildConfig(guildID: $guildID) {
            guildID
            prefix
        } 
    }
`;