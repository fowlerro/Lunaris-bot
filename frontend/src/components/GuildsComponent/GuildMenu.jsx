import React from 'react';

export function GuildMenu({guilds}) {

    return (
        <>
            {guilds.map((guild) => (
                <div>
                    <h5>{guild.name}</h5>
                    {/* <a href={`/dashboard/${guild.id}`}><Button type="button" label="Dashboard" /></a> */}
                </div>
            ))}
        </>
    )
}