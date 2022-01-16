interface IVariables {
    [variable: string]: any
}

const supportedFormatters = [
    {
        name: 'memberId', path: 'member.id',
        description: "Member's identificator"
    },
    {
        name: 'username', path: 'member.user.username',
        description: "Member's username"
    },
    {
        name: 'nickname', path: 'member.nickname',
        description: "Member's nickname"
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
        format = format.replace(value, (typeof variable === 'string' || typeof variable === 'number') ? variable : value)
    })

    return format
}