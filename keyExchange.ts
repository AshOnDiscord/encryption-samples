import { x25519 } from "@noble/curves/ed25519";

const priv = x25519.utils.randomPrivateKey();

// 1. The output includes parity byte. Strip it using shared.slice(1)
// 2. The output is not hashed. More secure way is sha256(shared) or hkdf(shared)
const someonesPub = x25519.getPublicKey(x25519.utils.randomPrivateKey());
const shared = x25519.getSharedSecret(priv, someonesPub);

console.log("Private key:     ", Buffer.from(priv).toString("hex"));
console.log("Public key:      ", Buffer.from(someonesPub).toString("hex"));
console.log("Shared secret:   ", Buffer.from(shared).toString("hex"));
