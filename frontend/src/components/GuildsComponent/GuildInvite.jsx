import { Button } from 'primereact/button';
import React from 'react';

export function GuildInvite({guilds}) {

    return (
        <>
            {guilds.map((guild) => (
                <div>
                    <h5>{guild.name}</h5>
                    <a href={`https://discord.com/oauth2/authorize?client_id=739412828737372181&guild_id=${guild.id}&permissions=8&redirect_uri=http%3A%2F%2Flocalhost%3A3001%2Fapi%2Fauth%2Fdiscord%2Finvite&response_type=code&scope=bot%20identify`}><Button type="button" label="Dodaj bota" /></a>
                </div>
            ))}
        </>
    )
}