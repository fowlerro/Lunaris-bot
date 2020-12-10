import React from 'react';
import { getUserDetails } from '../../utils/api';

export function DashboardPage({history}) {

    const [user, setUser] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        getUserDetails().then(({data}) => {
            setUser(data);
            setLoading(false);
        }).catch((err) => {
            history.push('/');
            setLoading(false);
        });
    }, [])

    return !loading && (
        <h1>DashboardPage</h1>
    )
}