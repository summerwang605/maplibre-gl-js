import aesjs from 'aes-js';

export function decryptVectorTileData(dataEncrypt: ArrayBuffer): Uint8Array {
    const keyBytes: Uint8Array = Uint8Array.from([
        57, 48, 55, 100, 99, 98, 56, 57,
        57, 98, 102, 101, 48, 97, 101, 98,
        57, 48, 53, 56, 52, 53, 56, 56,
        51, 101, 99, 51, 100, 56, 102, 53
    ]);
    const ivBytes: Uint8Array = Uint8Array.from([
        115, 105, 99, 100, 113,
        117, 112, 110, 48, 119,
        115, 110, 116, 117, 120,
        119
    ]);
    // 创建加密实例
    const aesCbc = new aesjs.ModeOfOperation.cbc(keyBytes, ivBytes);
    //var decryptedBytes = aesCbc.decrypt(new Uint8Array(dataEncrypt));
    try {
        const decryptedBytes = aesCbc.decrypt(dataEncrypt);
        return decryptedBytes;
    } catch (ex) {
        console.log('decrypt error', ex);
        return new Uint8Array(dataEncrypt);
    }
}


export function decryptVectorTileData2(dataEncrypt: ArrayBuffer): Uint8Array {
    const keyBytes: Uint8Array = Uint8Array.from([
        57, 48, 55, 100, 99, 98, 56, 57,
        57, 98, 102, 101, 48, 97, 101, 98,
        57, 48, 53, 56, 52, 53, 56, 56,
        51, 101, 99, 51, 100, 56, 102, 53
    ]);
    const ivBytes: Uint8Array = Uint8Array.from([
        115, 105, 99, 100, 113,
        117, 112, 110, 48, 119,
        115, 110, 116, 117, 120,
        119
    ]);
    // 创建加密实例
    const aesCbc = new aesjs.ModeOfOperation.cbc(keyBytes, ivBytes);
    return new Uint8Array(aesCbc.decrypt(dataEncrypt));
}


export function encryptVectorTileData2(data: ArrayBuffer): Uint8Array {
    const keyBytes: Uint8Array = Uint8Array.from([
        57, 48, 55, 100, 99, 98, 56, 57,
        57, 98, 102, 101, 48, 97, 101, 98,
        57, 48, 53, 56, 52, 53, 56, 56,
        51, 101, 99, 51, 100, 56, 102, 53
    ]);
    const ivBytes: Uint8Array = Uint8Array.from([
        115, 105, 99, 100, 113,
        117, 112, 110, 48, 119,
        115, 110, 116, 117, 120,
        119
    ]);
    // 创建加密实例
    const aesCbc = new aesjs.ModeOfOperation.cbc(keyBytes, ivBytes);
    return new Uint8Array(aesCbc.encrypt(data));
}


export function base64ToUint8Array(base64String: string): Uint8Array {
    // 解码Base64字符串
    const binaryString = atob(base64String);
    // 计算所需字节的长度
    const len = binaryString.length;
    // 创建一个Uint8Array来存储转换后的字节数据
    const bytes = new Uint8Array(len);
    // 将每个字符转换为对应的字节并存储在Uint8Array中
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    // 返回Uint8Array的底层ArrayBuffer
    return bytes;
}
