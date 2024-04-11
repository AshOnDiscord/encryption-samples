// import * from '@noble/curves'; // Error: use sub-imports, to ensure small app size
import { secp256k1 } from "@noble/curves/secp256k1"; // ESM and Common.js
// import { secp256k1 } from 'npm:@noble/curves@1.2.0/secp256k1'; // Deno
const priv = secp256k1.utils.randomPrivateKey();
const pub = secp256k1.getPublicKey(priv);
// const msg = new Uint8Array(32).fill(1); // message hash (not message) in ecdsa
const message = "Hello World";
let msg = new TextEncoder().encode(message);
const sig = secp256k1.sign(msg, priv); // `{prehash: true}` option is available
// msg = new TextEncoder().encode("DeadBeef"); // if you change the message it'll be invalid
const isValid = secp256k1.verify(sig, msg, pub) === true;

// hex strings are also supported besides Uint8Arrays:
const privHex = "46c930bc7bb4db7f55da20798697421b98c4175a52c630294d75a84b9c126236";
const pub2 = secp256k1.getPublicKey(privHex);

console.log("Private key:     ", Buffer.from(priv).toString("hex"));
console.log("Public key:      ", Buffer.from(pub).toString("hex"));
console.log("Public key 2:    ", Buffer.from(pub2).toString("hex"));
console.log("Signature:       ", sig.toCompactHex());
console.log("Message:         ", Buffer.from(msg).toString());
console.log("Valid signature? ", isValid);
