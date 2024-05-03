import { hkdf, expand, extract } from "@noble/hashes/hkdf";
import { sha256 } from "@noble/hashes/sha256";
import { randomBytes, bytesToHex } from "@noble/hashes/utils";
const inputKey = randomBytes(32);
const salt = randomBytes(32);
const info = "abc";
const dkLen = 32;
const hk1 = bytesToHex(hkdf(sha256, inputKey, salt, info, dkLen));

// == same as
const prk = extract(sha256, inputKey, salt);
const hk2 = bytesToHex(expand(sha256, prk, info, dkLen));

console.log(hk1, hk2, hk1 === hk2);
