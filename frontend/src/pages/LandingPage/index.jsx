import React from 'react';
import { Button } from 'primereact/button';

export function LandingPage(props) {
    const login = () => window.location.href = "http://localhost:3001/api/auth/discord";
    return (
        <Button label="Login" onClick={login} />
    )
}