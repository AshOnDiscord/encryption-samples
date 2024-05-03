// ECDH using curve25519 aka x25519
import {
  ed25519ctx,
  edwardsToMontgomeryPub,
  edwardsToMontgomeryPriv,
} from "@noble/curves/ed25519";
import { x25519 } from "@noble/curves/ed25519";
import { xchacha20poly1305 } from "@noble/ciphers/chacha";
import { randomBytes } from "@noble/ciphers/webcrypto";

const alicePriv = ed25519ctx.utils.randomPrivateKey();
const alicePub = ed25519ctx.getPublicKey(alicePriv);

const bobPriv = ed25519ctx.utils.randomPrivateKey();
const bobPub = ed25519ctx.getPublicKey(bobPriv);

const aliceShared = x25519.getSharedSecret(
  edwardsToMontgomeryPriv(alicePriv),
  edwardsToMontgomeryPub(bobPub)
);

const bobShared = x25519.getSharedSecret(
  edwardsToMontgomeryPriv(bobPriv),
  edwardsToMontgomeryPub(alicePub)
);

console.log("Alice private key: ", Buffer.from(alicePriv).toString("hex"));
console.log("Alice public key:  ", Buffer.from(alicePub).toString("hex"));
console.log("");
console.log("Bob private key:   ", Buffer.from(bobPriv).toString("hex"));
console.log("Bob public key:    ", Buffer.from(bobPub).toString("hex"));
console.log("");
console.log("Alice shared key:  ", Buffer.from(aliceShared).toString("hex"));
console.log("Bob shared key:    ", Buffer.from(bobShared).toString("hex"));
console.log(
  "Shared keys match? ",
  Buffer.compare(aliceShared, bobShared) === 0
);

const message = "From Alice to Bob!";
let msg = new TextEncoder().encode(message);

const nonce = randomBytes(24);

const cacha = xchacha20poly1305(aliceShared, nonce);
const encrypted = cacha.encrypt(msg);

console.log("\nMessage: ", message);
console.log("Nonce: ", Buffer.from(nonce).toString("hex"));
console.log("Encrypted: ", Buffer.from(encrypted).toString("hex"));

const signature = ed25519ctx.sign(msg, alicePriv, {
  context: Buffer.from("signing context").toString("hex"),
});

console.log("Signature: ", Buffer.from(signature).toString("hex"));

// Bob decrypts the message

console.log(
  "Is signature valid? ",
  ed25519ctx.verify(signature, msg, alicePub, {
    context: Buffer.from("signing context").toString("hex"),
    zip215: true,
  })
);
console.log("\nDecrypted: ", Buffer.from(cacha.decrypt(encrypted)).toString());
console.log(
  "Matching message? ",
  message === Buffer.from(cacha.decrypt(encrypted)).toString()
);
