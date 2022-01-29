import { MessageEmbedOptions } from "discord.js";
import { palette } from "../../utils/utils";

export default {
    messages: {
        edit: {
            color: palette.info,
            author: {
                name: "logs.messages.edit.title",
                iconURL: "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/282/memo_1f4dd.png"
            },
            fields: [
                {
                    name: "logs.general.member",
                    value: "{{mentionMessageAuthor}}\n`{{messageAuthorId}}`",
                    inline: true
                },
                {
                    name: "logs.messages.edit.sendedAt",
                    value: "{{messageSendedTime}}\n{{messageSendedTime:R}}",
                    inline: true
                },
                {
                    name: "general.before",
                    value: "{{messageContentBefore}}",
                    inline: false
                },
                {
                    name: "general.after",
                    value: "{{messageContentAfter}}",
                    inline: false
                }
            ],
            timestamp: new Date()
        },
        delete: {
            color: palette.error,
            author: {
                name: "logs.roles.delete.title",
                iconURL: "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/282/cross-mark_274c.png"
            },
            fields: [
                {
                    name: "logs.messages.delete.by",
                    value: "{{deletedByMention}}\n`{{deletedById}}`",
                    inline: true
                },
                {
                    name: "logs.general.messageAuthor",
                    value: "{{mentionMessageAuthor}}\n`{{messageAuthorId}}`",
                    inline: true
                },
                {
                    name: "\u200b",
                    value: "\u200b",
                    inline: true
                },
                {
                    name: "logs.messages.delete.inChannel",
                    value: "{{mentionMessageChannel}}",
                    inline: true
                },
                {
                    name: "logs.messages.edit.sendedAt",
                    value: "{{messageSendedTime}}\n{{messageSendedTime:R}}",
                    inline: true
                },
                {
                    name: "\u200b",
                    value: "\u200b",
                    inline: true
                },
                {
                    name: "general.message",
                    value: "{{messageContent}}",
                    inline: false
                }
            ],
            timestamp: new Date()
        },
        pin: {
            color: palette.info,
            author: {
                name: "logs.messages.pin.title"
            },
            fields: [
                {
                    name: "logs.general.moderator",
                    value: "{{moderatorMention}}\n`{{moderatorId}}`",
                    inline: true
                },
                {
                    name: "logs.general.messageAuthor",
                    value: "{{mentionMessageAuthor}}\n`{{messageAuthorId}}`",
                    inline: true
                },
                {
                    name: "general.channel",
                    value: "{{mentionMessageChannel}}\n`{{messageChannelId}}`",
                    inline: true
                },
                {
                    name: "general.message",
                    value: "{{messageContent}}",
                    inline: false
                }
            ],
            timestamp: new Date()
        },
        unpin: {
            color: palette.info,
            author: {
                name: "logs.messages.unpin.title"
            },
            fields: [
                {
                    name: "logs.general.moderator",
                    value: "{{moderatorMention}}\n`{{moderatorId}}`",
                    inline: true
                },
                {
                    name: "logs.general.messageAuthor",
                    value: "{{mentionMessageAuthor}}\n`{{messageAuthorId}}`",
                    inline: true
                },
                {
                    name: "general.channel",
                    value: "{{mentionMessageChannel}}\n`{{messageChannelId}}`",
                    inline: true
                },
                {
                    name: "general.message",
                    value: "{{messageContent}}",
                    inline: false
                }
            ],
            timestamp: new Date()
        },
    } as { [logType: string]: MessageEmbedOptions },
    members: {
        join: {
            color: palette.info,
            author: {
                name: "logs.members.join.title",
                iconURL: "{{memberAvatar}}"
            },
            fields: [
                {
                    name: "logs.general.member",
                    value: "{{mentionMember}}\n`{{memberId}}`",
                    inline: true
                },
                {
                    name: "logs.members.join.createdAt",
                    value: "{{memberCreatedAt}}\n{{memberCreatedAt:R}}",
                    inline: true
                }
            ],
            timestamp: new Date()
        },
        leave: {
            color: palette.info,
            author: {
                name: "logs.members.leave.title",
                iconURL: "{{memberAvatar}}"
            },
            fields: [
                {
                    name: "logs.general.member",
                    value: "{{mentionMember}}\n`{{memberId}}`",
                    inline: true
                },
                {
                    name: "logs.members.leave.joinedAt",
                    value: "{{memberJoinedAt}}\n{{memberJoinedAt:R}}",
                    inline: true
                },
                {
                    name: 'logs.members.leave.roles',
                    value: "{{memberRoles}}",
                    inline: false
                }
            ],
            timestamp: new Date()
        },
        
        warn: {
            color: palette.error,
            author: {
                name: "logs.members.warn.title",
                iconURL: "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/282/prohibited_1f6ab.png"
            },
            thumbnail: {
                url: "{{memberAvatar}}"
            },
            fields: [
                {
                    name: "logs.general.moderator",
                    value: "{{moderatorMention}}\n`{{moderatorId}}`",
                    inline: true
                },
                {
                    name: "logs.general.member",
                    value: "{{mentionMember}}\n`{{memberId}}`",
                    inline: true
                },
                {
                    name: "logs.members.warn.warnCount",
                    value: "{{memberWarnCount}}",
                    inline: false
                },
                {
                    name: "general.reason",
                    value: "```{{reason}}```",
                    inline: false
                }
            ],
            timestamp: new Date()
        },
        unwarn: {
            color: palette.success,
            author: {
                name: "logs.members.unwarn.title",
                iconURL: "https://emojipedia-us.s3.amazonaws.com/source/skype/289/check-mark_2714-fe0f.png"
            },
            thumbnail: {
                url: "{{memberAvatar}}"
            },
            fields: [
                {
                    name: "logs.general.moderator",
                    value: "{{moderatorMention}}\n`{{moderatorId}}`",
                    inline: true
                },
                {
                    name: "logs.general.member",
                    value: "{{mentionMember}}\n`{{memberId}}`",
                    inline: true
                },
                {
                    name: "logs.members.warn.warnCount",
                    value: "{{memberWarnCount}}",
                    inline: false
                },
                {
                    name: "general.reason",
                    value: "```{{reason}}```",
                    inline: false
                }
            ],
            timestamp: new Date()
        },

        kick: {
            color: palette.error,
            author: {
                name: "logs.members.kick.title",
                iconURL: "https://emojipedia-us.s3.amazonaws.com/source/skype/289/check-mark_2714-fe0f.png"
            },
            thumbnail: {
                url: "{{memberAvatar}}"
            },
            fields: [
                {
                    name: "logs.general.moderator",
                    value: "{{moderatorMention}}\n`{{moderatorId}}`",
                    inline: true
                },
                {
                    name: "logs.general.member",
                    value: "{{mentionMember}}\n`{{memberId}}`",
                    inline: true
                },
                {
                    name: "general.reason",
                    value: "```{{reason}}```",
                    inline: false
                }
            ],
            timestamp: new Date()
        },

        timeout: {
            color: palette.error,
            author: {
                name: "logs.members.timeout.title",
                iconURL: "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/282/muted-speaker_1f507.png"
            },
            thumbnail: {
                url: "{{memberAvatar}}"
            },
            fields: [
                {
                    name: "logs.general.moderator",
                    value: "{{moderatorMention}}\n`{{moderatorId}}`",
                    inline: true
                },
                {
                    name: "logs.general.member",
                    value: "{{mentionMember}}\n`{{memberId}}`",
                    inline: true
                },
                {
                    name: "logs.members.timeout.timeoutEnd",
                    value: "{{timeoutDate}}\n{{timeoutDateR}}",
                    inline: false
                },
                {
                    name: "general.reason",
                    value: "```{{reason}}```",
                    inline: false
                }
            ],
            timestamp: new Date()
        },
        timeoutEnd: {
            color: palette.success,
            author: {
                name: "logs.members.timeoutEnd.title",
                iconURL: "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/282/speaker-low-volume_1f508.png"
            },
            thumbnail: {
                url: "{{memberAvatar}}"
            },
            fields: [
                {
                    name: "logs.general.moderator",
                    value: "{{moderatorMention}}\n`{{moderatorId}}`",
                    inline: true
                },
                {
                    name: "logs.general.member",
                    value: "{{mentionMember}}\n`{{memberId}}`",
                    inline: true
                },
                {
                    name: "general.reason",
                    value: "```{{reason}}```",
                    inline: false
                }
            ],
            timestamp: new Date()
        },

        ban: {
            color: palette.error,
            author: {
                name: "logs.members.ban.title",
                iconURL: "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/282/prohibited_1f6ab.png"
            },
            thumbnail: {
                url: "{{memberAvatar}}"
            },
            fields: [
                {
                    name: "logs.general.moderator",
                    value: "{{moderatorMention}}\n`{{moderatorId}}`",
                    inline: false
                },
                {
                    name: "logs.general.member",
                    value: "{{mentionMember}}\n`{{memberId}}`",
                    inline: false
                },
                {
                    name: "logs.members.ban.bannedAt",
                    value: "{{DateNow}}\n{{DateNow:R}}",
                    inline: true
                },
                {
                    name: "logs.members.ban.unbanAt",
                    value: "{{unbanDate}}\n{{unbanDateR}}",
                    inline: true
                },
                {
                    name: "general.reason",
                    value: "```{{reason}}```",
                    inline: false
                }
            ]
        },
        unban: {
            color: palette.success,
            author: {
                name: "logs.members.unban.title",
                iconURL: "https://emojipedia-us.s3.amazonaws.com/source/skype/289/check-mark_2714-fe0f.png"
            },
            thumbnail: {
                url: "{{memberAvatar}}"
            },
            fields: [
                {
                    name: "logs.general.moderator",
                    value: "{{moderatorMention}}\n`{{moderatorId}}`",
                    inline: true
                },
                {
                    name: "logs.general.member",
                    value: "{{mentionMember}}\n`{{memberId}}`",
                    inline: true
                },
                {
                    name: "general.reason",
                    value: "```{{reason}}```",
                    inline: false
                }
            ],
            timestamp: new Date()
        }
    } as { [logType: string]: MessageEmbedOptions },
    roles: {
        create: {
            color: palette.info,
            author: {
                name: "logs.roles.create.title",
                iconURL: "https://emojipedia-us.s3.amazonaws.com/source/skype/289/check-mark_2714-fe0f.png"
            },
            fields: [
                {
                    name: "logs.general.moderator",
                    value: "{{moderatorMention}}\n`{{moderatorId}}`",
                    inline: true
                },
                {
                    name: "general.role",
                    value: "{{mentionRole}}\n`{{roleId}}`",
                    inline: true
                }
            ],
            timestamp: new Date()
        },
        delete: {
            color: palette.error,
            author: {
                name: "logs.roles.delete.title",
                iconURL: "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/282/cross-mark_274c.png"
            },
            fields: [
                {
                    name: "logs.general.moderator",
                    value: "{{moderatorMention}}\n`{{moderatorId}}`",
                    inline: true
                },
                {
                    name: "general.role",
                    value: "{{roleName}}",
                    inline: true
                },
                {
                    name: "logs.roles.delete.createdAt",
                    value: "{{roleCreatedAt}}\np{{roleCreatedAt:R}}",
                    inline: true
                }
            ],
            timestamp: new Date()
        },
        edit: {
            color: palette.info,
            author: {
                name: "logs.roles.edit.title"
            },
            fields: [
                {
                    name: "logs.general.moderator",
                    value: "{{moderatorMention}}\n`{{moderatorId}}`",
                    inline: true
                },
                {
                    name: "general.role",
                    value: "{{mentionRole}}\n`{{roleId}}`",
                    inline: true
                },
                {
                    name: "logs.roles.edit.edits",
                    value: "{{roleEdits}}",
                    inline: false
                }
            ],
            timestamp: new Date()
        },
        add: {
            color: palette.info,
            author: {
                name: "logs.roles.add.title"
            },
            thumbnail: {
                url: "{{memberAvatar}}"
            },
            fields: [
                {
                    name: "logs.general.moderator",
                    value: "{{moderatorMention}}\n`{{moderatorId}}`",
                    inline: true
                },
                {
                    name: "logs.general.member",
                    value: "{{mentionMember}}\n`{{memberId}}`",
                    inline: true
                },
                {
                    name: "general.role",
                    value: "{{mentionRole}}\n`{{roleId}}`",
                    inline: false
                }
            ],
            timestamp: new Date()
        },
        remove: {
            color: palette.error,
            author: {
                name: "logs.roles.remove.title"
            },
            thumbnail: {
                url: "{{memberAvatar}}"
            },
            fields: [
                {
                    name: "logs.general.moderator",
                    value: "{{moderatorMention}}\n`{{moderatorId}}`",
                    inline: true
                },
                {
                    name: "logs.general.member",
                    value: "{{mentionMember}}\n`{{memberId}}`",
                    inline: true
                },
                {
                    name: "general.role",
                    value: "{{mentionRole}}\n`{{roleId}}`",
                    inline: false
                }
            ],
            timestamp: new Date()
        }
    } as { [logType: string]: MessageEmbedOptions },
}