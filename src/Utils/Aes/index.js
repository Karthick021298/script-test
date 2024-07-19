import CryptoJS from 'crypto-js';

// Generate a random string
function randomString(length, chars) {
  let result = '';
  for (let i = length; i > 0; --i) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

// Ensure secretKey is available
const secretKeyString = 'mkoji8u7y6tgfdsxvb65tgfdre43wert';
if (!secretKeyString) {
  throw new Error('NEXT_PUBLIC_SECRET_KEY is not defined in the environment variables');
}

const secretKey = CryptoJS.enc.Latin1.parse(secretKeyString);

// Generate an IV key
const ivKeyString = randomString(16, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
const ivKey = CryptoJS.enc.Latin1.parse(ivKeyString);
const publicKey = CryptoJS.enc.Latin1.stringify(ivKey);

// Encryption function
export const encryption = (data) => {
  const plainText = CryptoJS.AES.encrypt(JSON.stringify(data), secretKey, {
    iv: ivKey,
  }).toString();
  return { plainText, publicKey };
};

// Decryption function
export const decryption = (res, key) => {
  try {
    const tempKey = key ? CryptoJS.enc.Latin1.parse(key) : CryptoJS.enc.Latin1.parse(res?.headers?.key);
    const cipherText = CryptoJS.enc.Base64.parse(res?.data ? res?.data : res);
    const isDecrypt = CryptoJS.lib.CipherParams.create({ ciphertext: cipherText });
    const bytes = CryptoJS.AES.decrypt(isDecrypt, secretKey, { iv: tempKey });
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
  } catch (error) {
    console.error('Decryption failed:', error);
    throw new Error('Decryption failed');
  }
};

// Failure login decryption function
export const failureLogin = (res) => {
  try {
    const cipherText = CryptoJS.enc.Base64.parse(res?.response?.data);
    const isDecrypt = CryptoJS.lib.CipherParams.create({ ciphertext: cipherText });
    const bytes = CryptoJS.AES.decrypt(isDecrypt, secretKey, {
      iv: CryptoJS.enc.Latin1.parse(res?.response?.headers?.key),
    });
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
  } catch (error) {
    console.error('Failure login decryption failed:', error);
    throw new Error('Failure login decryption failed');
  }
};
