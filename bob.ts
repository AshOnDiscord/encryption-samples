import { x25519, ed25519, edwardsToMontgomeryPriv, edwardsToMontgomeryPub } from "@noble/curves/ed25519";
// import { secp256k1 } from "@noble/curves/secp256k1"; // ESM and Common.js
import crypto from "crypto-browserify";

const privEd = ed25519.utils.randomPrivateKey();
const pubEd = ed25519.getPublicKey(privEd);
const priv = edwardsToMontgomeryPriv(privEd);
const pub = edwardsToMontgomeryPub(pubEd);

console.log("Static keys:");
console.log("ed25519 Private key: ", Buffer.from(privEd).toString("hex"));
console.log("ed25519 Public key:  ", Buffer.from(pubEd).toString("hex"));
console.log("x25519  Private key: ", Buffer.from(priv).toString("hex"));
console.log("x25519  Public key:  ", Buffer.from(pub).toString("hex"));
console.log("");

interface User {
  name: string;
  publicKey: string;
  id: string;
}

const users: Map<String, User> = new Map();
let id = "";

const ws = new WebSocket("ws://localhost:8080");
ws.onopen = () => {
  ws.send(
    JSON.stringify({
      type: "enter",
      name: "Bob",
      publicKey: Buffer.from(pub).toString("hex"),
    })
  );
};

ws.onmessage = (event) => {
  try {
    const json = JSON.parse(event.data.toString());
    if (json.type == "id") {
      id = json.id; // get id from server
      console.log("ID set: ", id);
    }
    if (json.type === "enter") {
      users.set(json.id, {
        name: json.name,
        publicKey: json.publicKey,
        id: json.id, // easy access to the id
      });
    } else if (json.type === "users") {
      // console.log("Users: ", json.users);
      json.users.forEach((user: User) => {
        const iv = crypto.randomBytes(12);
        const shared = x25519.getSharedSecret(priv, Buffer.from(user.publicKey, "hex"));
        const cipher = crypto.createCipheriv("AES-256-GCM", shared, iv);
        const message = `Hello ${user.name} - ${user.id}`;
        let encrypted = cipher.update(message, "utf8", "hex");
        encrypted += cipher.final("hex");
        const tag = cipher.getAuthTag();
        let msg = new TextEncoder().encode(encrypted);
        const sig = ed25519.sign(msg, privEd); // `{prehash: true}` option is available
        // msg = new TextEncoder().encode("DeadBeef"); // if you change the message it'll be invalid
        const isValid = ed25519.verify(sig, msg, pubEd) === true;
        console.log("Message:         ", message);
        console.log("Valid Signature: ", isValid);

        ws.send(
          JSON.stringify({
            type: "message",
            id: user.id,
            message: encrypted,
            sig: Buffer.from(sig).toString("hex"),
            pubEd: Buffer.from(pubEd).toString("hex"),
            iv: iv.toString("hex"),
            tag: tag.toString("hex"),
          })
        );
      });
    } else if (json.type === "message") {
      const user = users.get(json.id);
      if (!user) return;
      console.log("Received: ", json.message);
      const sig = Buffer.from(json.sig, "hex");
      const message = new TextEncoder().encode(json.message);
      const pubEd = Buffer.from(json.pubEd, "hex");
      const isValid = ed25519.verify(sig, message, pubEd) === true;
      console.log("Valid Signature: ", isValid);
      if (!isValid) {
        return;
      }
      const shared = x25519.getSharedSecret(priv, Buffer.from(user.publicKey, "hex"));
      const decipher = crypto.createDecipheriv("AES-256-GCM", shared, Buffer.from(json.iv, "hex"));
      decipher.setAuthTag(Buffer.from(json.tag, "hex"));
      let decrypted = decipher.update(json.message, "hex", "utf8");
      decrypted += decipher.final("utf8");

      console.log(`Decrypted:       `, decrypted);
    } else if (json.type === "exit") {
      users.delete(json.id);
    }
  } catch (e) {
    console.error(e);
  }
};
