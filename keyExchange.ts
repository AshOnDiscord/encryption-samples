// import * from '@noble/curves'; // Error: use sub-imports, to ensure small app size
import { secp256k1 } from "@noble/curves/secp256k1"; // ESM and Common.js
// import { secp256k1 } from 'npm:@noble/curves@1.2.0/secp256k1'; // Deno
const priv = secp256k1.utils.randomPrivateKey();

// 1. The output includes parity byte. Strip it using shared.slice(1)
// 2. The output is not hashed. More secure way is sha256(shared) or hkdf(shared)
const someonesPub = secp256k1.getPublicKey(secp256k1.utils.randomPrivateKey());
const shared = secp256k1.getSharedSecret(priv, someonesPub);

console.log("Private key:     ", Buffer.from(priv).toString("hex"));
console.log("Public key:      ", Buffer.from(someonesPub).toString("hex"));
console.log("Shared secret:   ", Buffer.from(shared).toString("hex"));
