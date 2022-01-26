import { Formatters, GuildMember } from "discord.js"
import { dateNow, memberAvatar, serverIcon } from "./customs"

interface IVariables {
    [variable: string]: any
}

export interface IFormatter {
    name: string;
    path?: string;
    customFunction?: (member: GuildMember) => string | null;
    type: string;
    mentionType?: 'member' | 'channel' | 'role';
    category: string;
    description: {
        en: string;
        pl: string;
    };
}

export const supportedFormatters: IFormatter[] = [
    // MEMBER
    {
        name: 'memberId', path: 'member.id',
        type: 'variable',
        category: 'member',
        description: {
            en: "Member's identificator",
            pl: "Identyfikator użytkownika"
        } 
    },
    {
        name: 'username', path: 'member.user.username',
        type: 'variable',
        category: 'member',
        description: {
            en: "Member's username",
            pl: "Nazwa użytkownika"
        }
    },
    {
        name: 'nickname', path: 'member.nickname',
        type: 'variable',
        category: 'member',
        description: {
            en: "Member's nickname, or username if doesn't have nickname",
            pl: "Pseudonim użytkownika lub nazwa, jeśli nie posiada pseudonimu"
        }
    },
    {
        name: 'discriminator', path: 'member.user.discriminator',
        type: 'variable',
        category: 'member',
        description: {
            en: "Tag numbers of the member",
            pl: "4 cyfrowy tag użytkownika"
        }
    },
    {
        name: 'tag', path: 'member.user.tag',
        type: 'variable',
        category: 'member',
        description: {
            en: "Member's username and discriminator (username#0000)",
            pl: "Nazwa oraz tag użytkownika (username#0000)"
        }
    },
    {
        name: 'memberCreatedAt', path: 'member.user.createdAt',
        type: 'variable',
        category: 'member',
        description: {
            en: "The date of the member's account creation",
            pl: "Data stworzenia konta użytkownika"
        }
    },
    {
        name: 'memberHighestRoleId', path: 'member.roles.highest.id',
        type: 'variable',
        category: 'member',
        description: {
            en: "The identificator of the highest member's role",
            pl: "Identyfikator najwyższej roli użytkownika"
        }
    },

    // GUILD
    {
        name: 'serverCreatedAt', path: 'guild.createdAt',
        type: 'variable',
        category: 'server',
        description: {
            en: "The date of the server creation",
            pl: "Data stworzenia serwera"
        }
    },
    {
        name: 'serverId', path: 'guild.id',
        type: 'variable',
        category: 'server',
        description: {
            en: "Server's identificator",
            pl: "Identyfikator serwera"
        }
    },
    {
        name: 'serverMemberCount', path: 'guild.memberCount',
        type: 'variable',
        category: 'server',
        description: {
            en: "Server members count",
            pl: "Ilość użytkowników na serwerze"
        }
    },
    {
        name: 'serverName', path: 'guild.name',
        type: 'variable',
        category: 'server',
        description: {
            en: "The name of this server",
            pl: "Nazwa tego serwera"
        }
    },
    {
        name: 'serverPreferredLocale', path: 'guild.preferredLocale',
        type: 'variable',
        category: 'server',
        description: {
            en: "Server's preferred locale",
            pl: "Preferowany język serwera"
        }
    },
    {
        name: 'serverRulesChannelId', path: 'guild.rulesChannelId',
        type: 'variable',
        category: 'server',
        description: {
            en: "Identificator of the rules channel in server",
            pl: "Identyfikator kanału zasad na serwerze"
        }
    },
    {
        name: 'serverOwnerId', path: 'guild.ownerId',
        type: 'variable',
        category: 'server',
        description: {
            en: "Identificator of the server's owner",
            pl: "Identyfikator właściciela serwera"
        }
    },

    // MENTIONS
    {
        name: 'mentionMember', path: 'member.id',
        type: 'mention',
        mentionType: 'member',
        category: 'member',
        description: {
            en: "Mention a member",
            pl: "Pinguje uzytkownika"
        }
    },
    {
        name: 'mentionMemberHighestRole', path: 'member.roles.highest.id',
        type: 'mention',
        mentionType: 'role',
        category: 'member',
        description: {
            en: "Mention a member's highest role",
            pl: "Pinguje najwyższą rolę użytkownika"
        }
    },
    {
        name: 'mentionOwner', path: 'guild.ownerId',
        type: 'mention',
        mentionType: 'member',
        category: 'server',
        description: {
            en: "Mention a server's owner",
            pl: "Pinguje właściciela serwera"
        }
    },

    // CUSTOM
    {
        name: 'DateNow', customFunction: dateNow,
        type: 'custom',
        category: 'other',
        description: {
            en: "Display date of sended message",
            pl: "Wyświetl datę wysłania wiadomości"
        }
    },
    {
        name: 'memberAvatar', customFunction: memberAvatar,
        type: 'custom',
        category: 'member',
        description: {
            en: "Send member's avatar URL",
            pl: "Wyślij URL awataru użytkownika"
        }
    },
    {
        name: 'serverIcon', customFunction: serverIcon,
        type: 'custom',
        category: 'server',
        description: {
            en: "Send server's icon URL",
            pl: "Wyślij URL ikonki serwera"
        }
    }
]

const regex = /{{[A-Za-z]{1,}}}/g

export default function TextFormatter(format: string, variables: IVariables) {
    const match = format.match(regex)
    if(!match) return format

    match.filter(value => 
        Boolean(supportedFormatters.find(format => 
            format.name === value.substring(2, value.length-2)
        ))
    ).forEach(value => {
        const valueName = value.substring(2, value.length-2)
        const supportedFormatter = supportedFormatters.find(format => format.name === valueName)!

        if(supportedFormatter.type === 'variable') return format = formatVariable(format, value, supportedFormatter, variables)
        if(supportedFormatter.type === 'mention') return format = formatMention(format, value, supportedFormatter, variables)
        if(supportedFormatter.type === 'custom') return format = formatCustom(format, value, supportedFormatter, variables)
    })

    return format
}

function formatVariable(format: string, value: string, formatter: IFormatter, variables: IVariables) {
    const variable = formatter.path?.split('.').reduce((a, prop) => a?.[prop], variables)
    format = format.replace(value, (typeof variable === 'string' || typeof variable === 'number') ? variable
        : (variable instanceof Date ? Formatters.time(variable) : value))

    return format
}

function formatMention(format: string, value: string, formatter: IFormatter, variables: IVariables) {
    const variable = formatter.path?.split('.').reduce((a, prop) => a?.[prop], variables)
    if(typeof variable !== 'string') return format
    const mention = formatter.mentionType === 'member' ? Formatters.memberNicknameMention(variable)
        : formatter.mentionType === 'role' ? Formatters.roleMention(variable)
        : formatter.mentionType === 'channel' ? Formatters.channelMention(variable)
        : value
    format = format.replace(value, mention)

    return format
}

function formatCustom(format: string, value: string, formatter: IFormatter, variables: IVariables) {
    if(!formatter.customFunction) return format
    const variable = formatter.customFunction(variables.member)
    if(!variable) return format
    format = format.replace(value, variable)

    return format
}