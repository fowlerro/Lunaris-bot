import { MessageEmbedOptions } from "discord.js";
import { palette } from "../../utils/utils";

export default {
    members: {
        memberJoin: {
            color: palette.info,
            author: {
                name: "logs.members.memberJoin.title",
                iconURL: "{{memberAvatar}}"
            },
            fields: [
                {
                    name: "logs.members.memberJoin.member",
                    value: "{{mentionMember}}\n{{memberId}}",
                    inline: true
                },
                {
                    name: "logs.members.memberJoin.createdAt",
                    value: "{{memberCreatedAt}}\n{{memberCreatedAt:R}}",
                    inline: true
                }
            ],
            timestamp: new Date()
        } as MessageEmbedOptions
    }
}