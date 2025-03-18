'use client';
import Cookies from 'js-cookie';
import parseToken from './parseJson';
import { useState, useEffect } from 'react';

export default function HeaderProfile() {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const token = Cookies.get('jwt_token');
        if (token) {
            setUserData(parseToken(token));
        }
    }, []);

    // Show loading only during client-side initialization
    if (!userData) {
        return (
            <div>
                <h1>Loading...</h1>
            </div>
        );
    }

    return (
        <div className="flex align-center">
            <h1 className="font-bold">Hello,
                <span> {`${userData.first_name || ''} ${userData.middle_name || ''} ${userData.last_name || ''}`.trim()}</span>
            </h1>
        </div>
    );
}
