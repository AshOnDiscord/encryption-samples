import { xchacha20poly1305 } from "@noble/ciphers/chacha";
import { utf8ToBytes } from "@noble/ciphers/utils";
import { randomBytes } from "@noble/ciphers/webcrypto/utils";
const key = randomBytes(32);
const nonce = randomBytes(24);
const chacha = xchacha20poly1305(key, nonce);
const data = utf8ToBytes("hello, noble");
const ciphertext = chacha.encrypt(data);
const data_ = chacha.decrypt(ciphertext); // utils.bytesToUtf8(data_) === data
console.log("Ciphertext: ", Buffer.from(ciphertext).toString("hex"));
console.log("Decrypted: ", Buffer.from(data_).toString());
