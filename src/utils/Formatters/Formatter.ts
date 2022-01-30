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
    mentionType?: 'member' | 'channel' | 'role' | 'emoji';
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

    // CHANNEL
    {
        name: "channelName", path: "channel.name",
        type: "variable",
        category: "channel",
        description: {
            en: "Channels's name",
            pl: "Nazwa kanału"
        }
    },
    {
        name: "channelId", path: "channel.id",
        type: "variable",
        category: "channel",
        description: {
            en: "Channel's identificator",
            pl: "Identyfikator kanału"
        }
    },
    {
        name: "channelCreatedAt", path: "channel.createdAt",
        type: "variableDate",
        category: "channel",
        description: {
            en: "Date of channel creation",
            pl: "Data stworzenia kanału"
        }
    },
    {
        name: "channelLastMessageId", path: "channel.lastMessageId",
        type: 'variable',
        category: 'channel',
        description: {
            en: "Last message's identificator in channel",
            pl: "Identykator ostatniej wiadomości na kanale"
        }
    },
    {
        name: "channelTopic", path: "channel.topic",
        type: 'variable',
        category: 'channel',
        description: {
            en: "Channel's topic",
            pl: "Opis kanału"
        }
    },
    {
        name: "channelCategoryName", path: "channel.parent.name",
        type: 'variable',
        category: 'channel',
        description: {
            en: "Channel's category name",
            pl: "Nazwa kategorii kanału"
        }
    },
    {
        name: "channelCategoryId", path: "channel.parentId",
        type: 'variable',
        category: 'channel',
        description: {
            en: "Channel's category identificator",
            pl: "Identyfikator kategorii kanału"
        }
    },

    // THREAD
    {
        name: "threadName", path: "thread.name",
        type: "variable",
        category: "thread",
        description: {
            en: "Thread's name",
            pl: "Nazwa wątka"
        }
    },
    {
        name: "threadId", path: "thread.id",
        type: "variable",
        category: "thread",
        description: {
            en: "Thread's identificator",
            pl: "Identyfikator wątka"
        }
    },
    {
        name: "threadOwnerId", path: "thread.ownerId",
        type: "variable",
        category: "thread",
        description: {
            en: "Thread's owner identificator",
            pl: "Identyfikator właściciela wątka"
        }
    },
    {
        name: "threadCreatedAt", path: "thread.createdAt",
        type: "variableDate",
        category: "thread",
        description: {
            en: "Thread creation date",
            pl: "Data stworzenia wątka"
        }
    },
    {
        name: "threadLastMessageId", path: "thread.lastMessageId",
        type: 'variable',
        category: 'thread',
        description: {
            en: "Last message's identificator in thread",
            pl: "Identykator ostatniej wiadomości w wątku"
        }
    },
    {
        name: "threadParentName", path: "thread.parent.name",
        type: 'variable',
        category: 'thread',
        description: {
            en: "Channel name, in which thread was created",
            pl: "Nazwa kanału w którym utworzono wątek"
        }
    },
    {
        name: "threadParentId", path: "thread.parentId",
        type: 'variable',
        category: 'thread',
        description: {
            en: "Threads's parent channel identificator",
            pl: "Identyfikator kanału, w którym utworzono wątek"
        }
    },
    {
        name: "threadAutoArchiveDuration", path: "thread.autoArchiveDuration",
        type: 'variable',
        category: 'thread',
        description: {
            en: "Inactive duration (in minutes) after which the thread will automatically archive",
            pl: "Czas nieaktywności (w minutach), po której wątek zostanie automatycznie zarchiwizowany"
        }
    },
    {
        name: "threadMemberCount", path: "thread.memberCount",
        type: 'variable',
        category: 'thread',
        description: {
            en: "Approximate count of users in thread",
            pl: "Przybliżona liczba użytkowników w wątku"
        }
    },
    {
        name: "threadMessageCount", path: "thread.messages.cache.size",
        type: 'variable',
        category: 'thread',
        description: {
            en: "Approximate count of messages in thread",
            pl: "Przybliżona liczba wiadomości w wątku"
        }
    },

    // INVITE
    {
        name: "inviteCode", path: "invite.code",
        type: "variable",
        category: "invite",
        description: {
            en: "Code of an invite",
            pl: "Kod zaproszenia"
        }
    },
    {
        name: "inviteCode", path: "invite.code",
        type: "variable",
        category: "invite",
        description: {
            en: "Code of an invite",
            pl: "Kod zaproszenia"
        }
    },
    {
        name: "inviteCode", path: "invite.code",
        type: "variable",
        category: "invite",
        description: {
            en: "Code of an invite",
            pl: "Kod zaproszenia"
        }
    },
    {
        name: "inviteChannelId", path: "invite.channelId",
        type: "variable",
        category: "invite",
        description: {
            en: "Channel for invite",
            pl: "Kanał dla zaproszenia"
        }
    },
    {
        name: "inviteCreatedAt", path: "invite.createdAt",
        type: "variableDate",
        category: "invite",
        description: {
            en: "Invite's creation date",
            pl: "Data stworzenia zaproszenia"
        }
    },
    {
        name: "inviteExpiresAt", path: "invite.expiresAt",
        type: "variableDate",
        category: "invite",
        description: {
            en: "Invite's expiration date",
            pl: "Data wygaśnięcia zaproszenia"
        }
    },
    {
        name: "inviteCreatorId", path: "invite.inviterId",
        type: "variable",
        category: "invite",
        description: {
            en: "Invite's creator identificator",
            pl: "Identyfikator twórcy zaproszenia"
        }
    },
    {
        name: "inviteMaxAge", path: "invite.maxAge",
        type: "variable",
        category: "invite",
        description: {
            en: "Maximum age of the invite in seconds",
            pl: "Maksymalny czas działania zaproszenia w sekundach"
        }
    },
    {
        name: "inviteMaxUses", path: "invite.maxUses",
        type: "variable",
        category: "invite",
        description: {
            en: "Maximum uses of the invite",
            pl: "Maksymalna ilość użyć zaproszenia"
        }
    },
    {
        name: "inviteUrl", path: "invite.url",
        type: "variable",
        category: "invite",
        description: {
            en: "URL of this invite",
            pl: "URL zaproszenia"
        }
    },
    {
        name: "inviteUses", path: "invite.uses",
        type: "variable",
        category: "invite",
        description: {
            en: "Usage count of the invite",
            pl: "Ilość użyć zaproszenia"
        }
    },
    {
        name: 'mentionInviteCreator', path: 'invite.inviterId',
        type: 'mention',
        mentionType: 'member',
        category: 'invite',
        description: {
            en: "Mention an invite's creator",
            pl: "Pinguje twórcę zaproszenia"
        }
    },
    {
        name: 'mentionInviteChannel', path: 'invite.channelId',
        type: 'mention',
        mentionType: 'channel',
        category: 'invite',
        description: {
            en: "Mention an invite's channel",
            pl: "Pinguje kanał zaproszenia"
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

    // EMOJI
    {
        name: 'emoji', path: 'emoji.id',
        type: 'mention',
        mentionType: 'emoji',
        category: 'emoji',
        description: {
            en: "Sends an emoji",
            pl: "Wysyła emotkę"
        }
    },
    {
        name: 'emojiName', path: 'emoji.name',
        type: 'variable',
        category: 'emoji',
        description: {
            en: "Emoji's name",
            pl: "Nazwa emotki"
        }
    },
    {
        name: 'emojiId', path: 'emoji.id',
        type: 'variable',
        category: 'emoji',
        description: {
            en: "Emoji's identificator",
            pl: "Identyfikator emotki"
        }
    },
    {
        name: 'emojiUrl', path: 'emoji.url',
        type: 'variable',
        category: 'emoji',
        description: {
            en: "Emoji's URL",
            pl: "URL emotki"
        }
    },
    {
        name: 'emojiCreatedAt', path: 'emoji.createdAt',
        type: 'variableDate',
        category: 'emoji',
        description: {
            en: "Date of emoji creation",
            pl: "Data dodania emotki"
        }
    },
    {
        name: 'emojiCreatorId', path: 'emoji.author.id',
        type: 'variable',
        category: 'emoji',
        description: {
            en: "Emoji's author identificator",
            pl: "Identyfikator autora emotki"
        }
    },
    {
        name: 'mentionEmojiCreator', path: 'emoji.author.id',
        type: 'mention',
        mentionType: 'member',
        category: 'emoji',
        description: {
            en: "Mention emoji's author",
            pl: "Pinguje autora emotki"
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
        name: 'mentionChannel', path: 'channel.id',
        type: 'mention',
        mentionType: 'channel',
        category: 'channel',
        description: {
            en: "Mention a channel",
            pl: "Pinguje kanał"
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
    {
        name: 'mentionThread', path: 'thread.id',
        type: 'mention',
        mentionType: 'channel',
        category: 'thread',
        description: {
            en: "Mention thread",
            pl: "Pinguje wątek"
        }
    },
    {
        name: 'mentionThreadParent', path: 'thread.parentId',
        type: 'mention',
        mentionType: 'channel',
        category: 'thread',
        description: {
            en: "Mention thread's parent channel",
            pl: "Pinguje kanał w którym wątek został utworzony"
        }
    },
    {
        name: 'mentionThreadOwner', path: 'thread.ownerId',
        type: 'mention',
        mentionType: 'member',
        category: 'thread',
        description: {
            en: "Mention thread's owner",
            pl: "Pinguje właściciela wątka"
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
        : formatter.mentionType === 'emoji' ? Formatters.formatEmoji(variable)
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