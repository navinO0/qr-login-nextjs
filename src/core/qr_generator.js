"use client"
import React from 'react';
import { useQRCode } from 'next-qrcode';
import Link from 'next/link';



function Qr_gen(props) {
    const { Canvas } = useQRCode();
    const { qr_link } = props
    const link = qr_link.link
    const code = qr_link.code
    const timeLeft = qr_link.time
    const formatTimeLeft = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };
    // console.log(code)
    return (
        <span className='popup-container'>
            <div style={{
                        // position: 'fixed',
                        // top: '10px',
                        // right: '10px',
                backgroundColor: 'rgba(0, 0, 0, 0.73)',
                opacity : 0.8,
                        color: 'white',
                        padding: '5px 10px',
                        borderRadius: '5px',
                        fontSize: '14px',
                    }}>
                        Expires in: {formatTimeLeft(timeLeft)}
                    </div>
        <Canvas
            text={link}
            options={{
                errorCorrectionLevel: 'M',
                margin: 3,
                scale: 4,
                width: 200,
                color: {
                    dark: '#000000',
                    light: '#ffffff',
                },
            }}
            />
            <span>{code}</span>
            <span>{link}</span>
        </span>
    );
}

export default Qr_gen;