import * as crypto from 'crypto';

const algorithm = 'aes-256-cbc';
const ivLength = 16; // AES block size

export function decryptVectorTileBuffer(encryptedBuffer: ArrayBuffer): ArrayBuffer {
    const keyBytes1: Uint8Array = new Uint8Array([
        252, 159, 116, 47, 97, 45, 39,
        184, 247, 166, 135, 108, 131, 186,
        49, 193, 218, 17, 74, 153, 146,
        150, 127, 16, 150, 32, 121, 240,
        225, 227, 126, 158
    ]);
    // 将 Buffer 转换为 Uint8Array
    const ivBytes1: Uint8Array = new Uint8Array([
        140, 75, 77, 80, 104,
        20, 177, 89, 101, 123,
        81, 198, 222, 45, 139,
        243
    ]);

    const decipher = crypto.createDecipheriv('aes-256-cbc', keyBytes1, ivBytes1);
    // 解密数据
    let decrypted = Buffer.concat([decipher.update(Buffer.from(encryptedBuffer)), decipher.final()]);
    return decrypted;
}


// 将 ArrayBuffer 转换为 CryptoKey 对象
async function importKey(rawKey: ArrayBuffer, algorithm: string): Promise<CryptoKey> {
    return crypto.subtle.importKey(
        'raw',
        rawKey,
        algorithm,
        false,
        ['decrypt']
    );
}
/**
 * 使用web支持的解密方法
 * @param encryptedBuffer
 */
export async function decryptArrayBufferByWeb(encryptedBuffer: ArrayBuffer): Promise<ArrayBuffer> {
    const keyBytes1: Uint8Array = new Uint8Array([
        252, 159, 116, 47, 97, 45, 39,
        184, 247, 166, 135, 108, 131, 186,
        49, 193, 218, 17, 74, 153, 146,
        150, 127, 16, 150, 32, 121, 240,
        225, 227, 126, 158
    ]);
    // 将 Buffer 转换为 Uint8Array
    const ivBytes1: Uint8Array = new Uint8Array([
        140, 75, 77, 80, 104,
        20, 177, 89, 101, 123,
        81, 198, 222, 45, 139,
        243
    ]);

    const algorithm = {
        name: 'AES-CBC',
        iv: ivBytes1
    };
    const cryptoKey = await importKey(keyBytes1, algorithm.name);
    const decryptedData = await crypto.subtle.decrypt(algorithm, cryptoKey, encryptedBuffer);
    return decryptedData;
}


