import React from 'react';
import { useQRCode } from 'next-qrcode';
import Link from 'next/link';

function Qr_gen(props) {
    const { Canvas } = useQRCode();
    const { qr_link } = props
    const link = qr_link.link
    return (
        <div className='popup-container'>
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
            <h2>{link}</h2>
        </div>
    );
}

export default Qr_gen;