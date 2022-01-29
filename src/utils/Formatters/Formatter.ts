import { Formatters, GuildMember } from "discord.js"
import { dateNow, memberAvatar, serverIcon } from "./customs"

interface IVariables {
    [variable: string]: any
}

export interface IFormatter {
    name: string;
    path?: string;
    customFunction?: (member: GuildMember, ...vars: any) => string | null;
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
        type: 'variableDate',
        category: 'member',
        description: {
            en: "The date of the member's account creation",
            pl: "Data stworzenia konta użytkownika"
        }
    },
    {
        name: 'memberJoinedAt', path: 'member.joinedAt',
        type: 'variableDate',
        category: 'member',
        description: {
            en: "The date when member joined to the server",
            pl: "Data dołączenia użytkownika na serwer"
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
        type: 'variableDate',
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

    // ROLE
    {
        name: "roleName", path: "role.name",
        type: "variable",
        category: "role",
        description: {
            en: "Role's name",
            pl: "Nazwa roli"
        }
    },
    {
        name: "roleId", path: "role.id",
        type: "variable",
        category: "role",
        description: {
            en: "Role's identificator",
            pl: "Identyfikator roli"
        }
    },
    {
        name: "roleColor", path: "role.hexColor",
        type: "variable",
        category: "role",
        description: {
            en: "Role's color in HEX",
            pl: "Kolor HEX roli"
        }
    },
    {
        name: "roleHoist", path: "role.hoist",
        type: "variable",
        category: "role",
        description: {
            en: "Returns `true`, if role is hoisted, or `false` if not",
            pl: "Zwraca `true` jeśli rola wyświetlana jest osobno na liście użytkowników, lub `false` jeśli nie"
        }
    },
    {
        name: "roleCreatedAt", path: "role.createdAt",
        type: "variableDate",
        category: "role",
        description: {
            en: "Date of role creation",
            pl: "Data stworzenia roli"
        }
    },
    {
        name: "rolePosition", path: "role.position",
        type: "variable",
        category: "role",
        description: {
            en: "Role's position in role list",
            pl: "Pozycja roli na liście ról"
        }
    },

    // MESSAGE
    {
        name: 'messageId', path: 'message.id',
        type: 'variable',
        category: 'message',
        description: {
            en: "Message's identificator",
            pl: "Identyfikator wiadomości"
        } 
    },
    {
        name: 'messageContent', path: 'message.content',
        type: 'variable',
        category: 'message',
        description: {
            en: "Message content",
            pl: "Treść wiadomości"
        }
    },
    {
        name: 'messageCleanContent', path: 'message.cleanContent',
        type: 'variable',
        category: 'message',
        description: {
            en: "Message content with all mentions replaces by the equivalent text",
            pl: "Treść wiadomości z wszystkimi wzmiankami zamienionymi na tekst"
        }
    },
    {
        name: 'messageChannelId', path: 'message.channelId',
        type: 'variable',
        category: 'message',
        description: {
            en: "Identificator of channel in which message was sent",
            pl: "Identyfikator kanału, w którym została wysłana wiadomość"
        }
    },
    {
        name: 'messageAuthorId', path: 'message.author.id',
        type: 'variable',
        category: 'message',
        description: {
            en: "Identificator of message's author",
            pl: "Identyfikator autora wiadomości"
        }
    },
    {
        name: 'messageSendedTime', path: 'message.createdAt',
        type: 'variableDate',
        category: 'message',
        description: {
            en: "The date when message was sent",
            pl: "Data wysłania wiadomości"
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
    {
        name: 'mentionRole', path: 'role.id',
        type: 'mention',
        mentionType: 'role',
        category: 'role',
        description: {
            en: "Mention a role",
            pl: "Pinguje rolę"
        }
    },
    {
        name: 'mentionMessageAuthor', path: 'message.author.id',
        type: 'mention',
        mentionType: 'member',
        category: 'message',
        description: {
            en: "Mention a message's author",
            pl: "Pinguje autora wiadomości"
        }
    },
    {
        name: 'mentionMessageChannel', path: 'message.channelId',
        type: 'mention',
        mentionType: 'channel',
        category: 'message',
        description: {
            en: "Mention a channel in which message was sent",
            pl: "Pinguje kanał, w którym wiadomość została wysłana"
        }
    },

    // CUSTOM
    {
        name: 'DateNow', customFunction: dateNow,
        type: 'customDate',
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

const regex = /{{[A-Za-z:]{1,}}}/g

export default function TextFormatter(format: string, variables: IVariables) {
    const match = format.match(regex)
    if(!match) return format

    match.filter(value => 
        Boolean(supportedFormatters.find(format => 
            format.name === value.substring(2, value.length-2)
            || ((format.type === 'variableDate' || format.type === 'customDate') && format.name === value.substring(2, value.length-4))
            || (variables?.customs && value.substring(2, value.length-2) in variables?.customs)
        ))
    ).forEach(value => {
        const valueName = value.substring(2, value.length-2)
        if(variables?.customs && valueName in variables?.customs) return format = formatCustomVariable(format, value, variables)
        const supportedFormatter = supportedFormatters.find(format => format.name === valueName || format.name === valueName.substring(0, valueName.length-2))!
        if(!supportedFormatter) return format
        if(supportedFormatter.type === 'variable') return format = formatVariable(format, value, supportedFormatter, variables)
        if(supportedFormatter.type === 'variableDate') return format = formatVariableDate(format, value, supportedFormatter, variables)
        if(supportedFormatter.type === 'mention') return format = formatMention(format, value, supportedFormatter, variables)
        if(supportedFormatter.type === 'custom') return format = formatCustom(format, value, supportedFormatter, variables)
        if(supportedFormatter.type === 'customDate') return format = formatCustomDate(format, value, supportedFormatter, variables)
    })

    return format
}

function formatVariable(format: string, value: string, formatter: IFormatter, variables: IVariables) {
    const variable = formatter.path?.split('.').reduce((a, prop) => a?.[prop], variables)
    format = format.replace(value, (typeof variable === 'string' || typeof variable === 'number') ? variable
        : (variable instanceof Date ? Formatters.time(variable) : value))

    return format
}

function formatVariableDate(format: string, value: string, formatter: IFormatter, variables: IVariables) {
    const dateStyle = value.substring(2, value.length-2).split(':')[1] as typeof Formatters.TimestampStylesString || 'f'
    const variable = formatter.path?.split('.').reduce((a, prop) => a?.[prop], variables)
    format = format.replace(value, (typeof variable === 'string' || typeof variable === 'number') ? variable
        : (variable instanceof Date ? Formatters.time(variable, dateStyle) : value))

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

function formatCustomDate(format: string, value: string, formatter: IFormatter, variables: IVariables) {
    const dateStyle = value.substring(2, value.length-2).split(':')[1] as typeof Formatters.TimestampStylesString || 'f'
    if(!formatter.customFunction) return format
    const variable = formatter.customFunction(variables.member, dateStyle)
    if(!variable) return format
    format = format.replace(value, variable)

    return format
}

function formatCustomVariable(format: string, value: string, variables: IVariables) {
    const valueName = value.substring(2, value.length-2)
    const variable = variables?.customs?.[valueName]
    return variable ? format.replace(value, variable) : format
}