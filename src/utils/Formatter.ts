interface IVariables {
    [variable: string]: any
}

const supportedFormatters = [
    // MEMBER
    {
        name: 'memberId', path: 'member.id',
        description: {
            en: "Member's identificator",
            pl: "Identyfikator użytkownika"
        } 
    },
    {
        name: 'username', path: 'member.user.username',
        description: {
            en: "Member's username",
            pl: "Nazwa użytkownika"
        }
    },
    {
        name: 'nickname', path: 'member.nickname',
        description: {
            en: "Member's nickname, or username if doesn't have nickname",
            pl: "Pseudonim użytkownika lub nazwa, jeśli nie posiada pseudonimu"
        }
    },
    {
        name: 'discriminator', path: 'member.user.discriminator',
        description: {
            en: "Tag numbers of the member",
            pl: "4 cyfrowy tag użytkownika"
        }
    },
    {
        name: 'tag', path: 'member.user.tag',
        description: {
            en: "Member's username and discriminator (username#0000)",
            pl: "Nazwa oraz tag użytkownika (username#0000)"
        }
    },
    {
        name: 'memberCreatedAt', path: 'member.user.createdAt',
        description: {
            en: "The date of the member's account creation",
            pl: "Data stworzenia konta użytkownika"
        }
    },
    // GUILD
    {
        name: 'serverCreatedAt', path: 'guild.createdAt',
        description: {
            en: "The date of the server creation",
            pl: "Data stworzenia serwera"
        }
    },
    {
        name: 'serverId', path: 'guild.id',
        description: {
            en: "Server's identificator",
            pl: "Identyfikator serwera"
        }
    },
    {
        name: 'serverMemberCount', path: 'guild.memberCount',
        description: {
            en: "Server members count",
            pl: "Ilość użytkowników na serwerze"
        }
    },
    {
        name: 'serverName', path: 'guild.name',
        description: {
            en: "The name of this server",
            pl: "Nazwa tego serwera"
        }
    },
    {
        name: 'serverPreferredLocale', path: 'guild.preferredLocale',
        description: {
            en: "Server's preferred locale",
            pl: "Preferowany język serwera"
        }
    },
    {
        name: 'serverRulesChannelId', path: 'guild.rulesChannelId',
        description: {
            en: "Identificator of the rules channel in server",
            pl: "Identyfikator kanału zasad na serwerze"
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
            && format.path.split('.').reduce((a, prop) => a?.[prop], variables)
        ))
    ).forEach(value => {
        const valueName = value.substring(2, value.length-2)
        const supportedVariable = supportedFormatters.find(format => format.name === valueName)!
        const variable = supportedVariable.path.split('.').reduce((a, prop) => a[prop], variables)
        format = format.replace(value, (typeof variable === 'string' || typeof variable === 'number') ? variable
            : (variable instanceof Date ? variable.toUTCString() : value))
    })

    return format
}