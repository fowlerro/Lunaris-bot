import { MessageEmbedOptions } from "discord.js";
import { palette } from "../../utils/utils";

export default {
    members: {
        join: {
            color: palette.info,
            author: {
                name: "logs.members.join.title",
                iconURL: "{{memberAvatar}}"
            },
            fields: [
                {
                    name: "logs.members.join.member",
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
                    name: "logs.members.join.member",
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
                    name: "logs.members.ban.moderator",
                    value: "{{moderatorMention}}\n`{{moderatorId}}`",
                    inline: true
                },
                {
                    name: "logs.members.ban.target",
                    value: "{{mentionMember}}\n`{{memberId}}`",
                    inline: true
                },
                {
                    name: "logs.members.warn.warnCount",
                    value: "{{memberWarnCount}}",
                    inline: false
                },
                {
                    name: "logs.members.ban.reason",
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
                    name: "logs.members.ban.moderator",
                    value: "{{moderatorMention}}\n`{{moderatorId}}`",
                    inline: true
                },
                {
                    name: "logs.members.ban.target",
                    value: "{{mentionMember}}\n`{{memberId}}`",
                    inline: true
                },
                {
                    name: "logs.members.warn.warnCount",
                    value: "{{memberWarnCount}}",
                    inline: false
                },
                {
                    name: "logs.members.ban.reason",
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
                    name: "logs.members.ban.moderator",
                    value: "{{moderatorMention}}\n`{{moderatorId}}`",
                    inline: true
                },
                {
                    name: "logs.members.ban.target",
                    value: "{{mentionMember}}\n`{{memberId}}`",
                    inline: true
                },
                {
                    name: "logs.members.ban.reason",
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
                    name: "logs.members.ban.moderator",
                    value: "{{moderatorMention}}\n`{{moderatorId}}`",
                    inline: true
                },
                {
                    name: "logs.members.ban.target",
                    value: "{{mentionMember}}\n`{{memberId}}`",
                    inline: true
                },
                {
                    name: "logs.members.timeout.timeoutEnd",
                    value: "{{timeoutDate}}\n{{timeoutDateR}}",
                    inline: false
                },
                {
                    name: "logs.members.ban.reason",
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
                    name: "logs.members.ban.moderator",
                    value: "{{moderatorMention}}\n`{{moderatorId}}`",
                    inline: true
                },
                {
                    name: "logs.members.ban.target",
                    value: "{{mentionMember}}\n`{{memberId}}`",
                    inline: true
                },
                {
                    name: "logs.members.ban.reason",
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
                    name: "logs.members.ban.moderator",
                    value: "{{moderatorMention}}\n`{{moderatorId}}`",
                    inline: false
                },
                {
                    name: "logs.members.ban.target",
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
                    name: "logs.members.ban.reason",
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
                    name: "logs.members.ban.moderator",
                    value: "{{moderatorMention}}\n`{{moderatorId}}`",
                    inline: true
                },
                {
                    name: "logs.members.ban.target",
                    value: "{{mentionMember}}\n`{{memberId}}`",
                    inline: true
                },
                {
                    name: "logs.members.ban.reason",
                    value: "```{{reason}}```",
                    inline: false
                }
            ],
            timestamp: new Date()
        }
    } as { [logType: string]: MessageEmbedOptions }
}