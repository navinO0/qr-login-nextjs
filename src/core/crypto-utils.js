"use client"; 
const KEY_HEX = process.env.NEXT_PUBLIC_KEY_HEX;

// Convert a hex string to a Uint8Array
function hexToUint8Array(hex) {
    return new Uint8Array(hex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
}

// Encrypt object values with IV and authentication tag
async function encryptObjectValues(obj) {
    const keyBuffer = hexToUint8Array(KEY_HEX);
    const key = await crypto.subtle.importKey(
        "raw",
        keyBuffer,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt"]
    );

    const encryptedObject = {};

    for (const [keyName, value] of Object.entries(obj)) {
        const ivBuffer = crypto.getRandomValues(new Uint8Array(12)); 
        const encodedValue = new TextEncoder().encode(String(value));

        const encryptedBuffer = await crypto.subtle.encrypt(
            { name: "AES-GCM", iv: ivBuffer },
            key,
            encodedValue
        );

        // Convert encrypted data to Uint8Array
        const encryptedData = new Uint8Array(encryptedBuffer);

        // Convert IV + encrypted data to Base64
        const ivBase64 = Buffer.from(ivBuffer).toString("base64");
        const encryptedBase64 = Buffer.from(encryptedData).toString("base64");

        encryptedObject[keyName] = `${ivBase64}:${encryptedBase64}`; // Store IV and encrypted data
    }

    return encryptedObject;
}

async function decryptObjectValues(encryptedData) {
    const keyBuffer = hexToUint8Array(KEY_HEX);
    const ivBuffer = hexToUint8Array(encryptedData.iv);

    const key = await crypto.subtle.importKey(
        "raw",
        keyBuffer,
        { name: "AES-GCM", length: 256 },
        false,
        ["decrypt"]
    );

    const decryptedObject = {};

    for (const [keyName, encryptedValue] of Object.entries(encryptedData.encryptedObject)) {
        const encryptedBuffer = Uint8Array.from(Buffer.from(encryptedValue, "base64"));
        const decryptedBuffer = await crypto.subtle.decrypt(
            { name: "AES-GCM", iv: ivBuffer },
            key,
            encryptedBuffer
        );
        decryptedObject[keyName] = new TextDecoder().decode(decryptedBuffer);
    }

    return decryptedObject;
}

export { encryptObjectValues, decryptObjectValues };
