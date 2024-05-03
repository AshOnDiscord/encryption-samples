import { Hex } from "@noble/curves/abstract/utils";
import { ed25519ctx } from "@noble/curves/ed25519";

const priv = ed25519ctx.utils.randomPrivateKey();
const pub = ed25519ctx.getPublicKey(priv);

const message = "Hello World";
let msg = new TextEncoder().encode(message);

const signingContext = Buffer.from("signing context").toString("hex") as Hex;
const sig = ed25519ctx.sign(msg, priv, {
  context: signingContext,
});

const isValid =
  ed25519ctx.verify(sig, msg, pub, {
    context: signingContext,
    zip215: true, // zip215 is true by default, when the options object is provided it must be explicitly provided
  }) === true;

console.log("Private key:     ", Buffer.from(priv).toString("hex"));
console.log("Public key:      ", Buffer.from(pub).toString("hex"));
// console.log("Signature:       ", sig.toCompactHex());
console.log("Signature:       ", Buffer.from(sig).toString("hex"));
console.log("Message:         ", Buffer.from(msg).toString());
console.log("Valid signature? ", isValid);
