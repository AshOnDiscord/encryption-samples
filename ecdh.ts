// ECDH using curve25519 aka x25519
import { x25519 } from "@noble/curves/ed25519";
import crypto from "crypto-browserify";
// const bobPriv = x25519.utils.randomPrivateKey();
// const bobPub = x25519.getPublicKey(bobPriv);
// const alicePriv = x25519.utils.randomPrivateKey();
// const alicePub = x25519.getPublicKey(alicePriv);

const bobPriv = Buffer.from("2ca85366c23335f7d87302c212d09cc66327f806277f0af6cf4c5df9a304960c", "hex");
const bobPub = Buffer.from("51a71e244ce426b85a2aad1f72267681a311d017741c7d17c14d5f90f1c02446", "hex");

const alicePriv = Buffer.from("3fb493e1d606e378abed34c9554523711606abf233c89a2578e772599b730820", "hex");
const alicePub = Buffer.from("10e244c77e4595395c0f1c54d7d2f2802f086e4f967f33de6468b0dfa316aa28", "hex");

const bobShared = x25519.getSharedSecret(bobPriv, alicePub);
const aliceShared = x25519.getSharedSecret(alicePriv, bobPub);
console.log("Bob's Private key:     ", Buffer.from(bobPriv).toString("hex"));
console.log("Bob's public key:      ", Buffer.from(bobPub).toString("hex"));
console.log("Alice's Private key:   ", Buffer.from(alicePriv).toString("hex"));
console.log("Alice's public key:    ", Buffer.from(alicePub).toString("hex"));
console.log("Bob shared:         ", Buffer.from(bobShared).toString("hex"));
console.log("Alice shared:       ", Buffer.from(aliceShared).toString("hex"));

const bobToAlice = "Hello Bob";

// send message from bob to alice
const iv = crypto.randomBytes(12);
const bobToAliceCipher = crypto.createCipheriv("AES-256-GCM", bobShared, iv);
let encrypted = bobToAliceCipher.update(bobToAlice, "utf8", "hex");
encrypted += bobToAliceCipher.final("hex");
const bobToAliceTag = bobToAliceCipher.getAuthTag();
console.log("Bob to Alice Encrypted: ", encrypted);
console.log("Bob to Alice Tag: ", bobToAliceTag.toString("hex"));

// alice decrypts message from bob
const bobToAliceMessage = new TextEncoder().encode(encrypted);
const bobToAliceDecipher = crypto.createDecipheriv("AES-256-GCM", aliceShared, iv);
bobToAliceDecipher.setAuthTag(bobToAliceTag);
let bobToAliceDecrypted = bobToAliceDecipher.update(new TextDecoder().decode(bobToAliceMessage), "hex", "utf8");
bobToAliceDecrypted += bobToAliceDecipher.final("utf8");

console.log("iv: ", iv.toString("hex"));
console.log("Bob to Alice Decrypted: ", bobToAliceDecrypted);
