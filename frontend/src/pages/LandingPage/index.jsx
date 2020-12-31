import React from 'react';
import { useThemeSwitcher } from 'react-css-theme-switcher';
import {Switch} from 'antd';
import { Navbar } from '../../components';

export function LandingPage(props) {

    const [isDarkMode, setIsDarkMode] = React.useState();
    const {switcher, currentTheme, status, themes} = useThemeSwitcher();

    const toggleTheme = (isChecked) => {
        setIsDarkMode(isChecked);
        switcher({theme: isChecked ? themes.dark : themes.light});
    }

    if(status === "loading") return null;
    
    const login = () => window.location.href = "http://localhost:3001/api/auth/discord";

    return (
        <>
            <div className="card">
                <Navbar user="User" />
                <Switch checked={isDarkMode} onChange={toggleTheme} />
            </div>
        </>
    )
}