import { x25519 } from "@noble/curves/ed25519";
import { sha512 } from "@noble/hashes/sha512";
import { sha3_512, keccak_512, shake256 } from "@noble/hashes/sha3";
import { ripemd160 } from "@noble/hashes/ripemd160";
import { blake3 } from "@noble/hashes/blake3";
import { blake2b } from "@noble/hashes/blake2b";
import { hmac } from "@noble/hashes/hmac";
import { hkdf } from "@noble/hashes/hkdf";
import { pbkdf2 } from "@noble/hashes/pbkdf2";
import { scrypt } from "@noble/hashes/scrypt";
import { argon2d, argon2i, argon2id } from "@noble/hashes/argon2";
import { bytesToHex as toHex, randomBytes } from "@noble/hashes/utils";

let timer = Date.now();

const message = "hello, noble";
const secret = x25519.utils.randomPrivateKey();

// speed focused algorithms
timer = Date.now();
const sha512Hash = sha512(message);
console.log(
  "SHA-512 Hash: ",
  toHex(sha512Hash),
  "Time: ",
  Date.now() - timer,
  "ms"
);

timer = Date.now();
const sha3_512Hash = sha3_512(message);
console.log(
  "SHA3-512 Hash: ",
  toHex(sha3_512Hash),
  "Time: ",
  Date.now() - timer,
  "ms"
);

timer = Date.now();
const keccak_512Hash = keccak_512(message);
console.log(
  "Keccak-512 Hash: ",
  toHex(keccak_512Hash),
  "Time: ",
  Date.now() - timer,
  "ms"
);

timer = Date.now();
const shake256Hash = shake256(message);
console.log(
  "Shake256 Hash: ",
  toHex(shake256Hash),
  "Time: ",
  Date.now() - timer,
  "ms"
);

timer = Date.now();
const ripemd160Hash = ripemd160(message);
console.log(
  "RIPEMD-160 Hash: ",
  toHex(ripemd160Hash),
  "Time: ",
  Date.now() - timer,
  "ms"
);

timer = Date.now();
const blake3Hash = blake3(message);
console.log(
  "Blake3 Hash: ",
  toHex(blake3Hash),
  "Time: ",
  Date.now() - timer,
  "ms"
);

timer = Date.now();
const blake2bHash = blake2b(message);
console.log(
  "Blake2b Hash: ",
  toHex(blake2bHash),
  "Time: ",
  Date.now() - timer,
  "ms"
);

// security focused algorithms
timer = Date.now();
const hmacSha512 = hmac(sha512, secret, message);
console.log(
  "HMAC-SHA-512: ",
  toHex(hmacSha512),
  "Time: ",
  Date.now() - timer,
  "ms"
);

timer = Date.now();
const hkdfSha512 = hkdf(sha512, message, "salt", "info?", 32);
console.log(
  "HKDF-SHA-512: ",
  toHex(hkdfSha512),
  "Time: ",
  Date.now() - timer,
  "ms"
);

timer = Date.now();
const pbkdf2Sha512 = pbkdf2(sha512, message, "salt", { c: 32, dkLen: 32 });
console.log(
  "PBKDF2-SHA-512: ",
  toHex(pbkdf2Sha512),
  "Time: ",
  Date.now() - timer,
  "ms"
);

// timer = Date.now();
// const scryptHash = scrypt(message, "salt", {
//   N: 2 ** 16,
//   r: 8,
//   p: 1,
//   dkLen: 32,
// });
// console.log(
//   "Scrypt Hash: ",
//   toHex(scryptHash),
//   "Time: ",
//   Date.now() - timer,
//   "ms"
// );

// // memory hard algorithms
// timer = Date.now();
// const argon2dHash = argon2d(message, "saltySalt", { t: 2, m: 65536, p: 1 });
// console.log(
//   "Argon2d Hash: ",
//   toHex(argon2dHash),
//   "Time: ",
//   Date.now() - timer,
//   "ms"
// );

// timer = Date.now();
// const argon2iHash = argon2i(message, "saltySalt", { t: 2, m: 65536, p: 1 });
// console.log(
//   "Argon2i Hash: ",
//   toHex(argon2iHash),
//   "Time: ",
//   Date.now() - timer,
//   "ms"
// );

// timer = Date.now();
// const argon2idHash = argon2id(message, "saltySalt", { t: 2, m: 65536, p: 1 });
// console.log(
//   "Argon2id Hash: ",
//   toHex(argon2idHash),
//   "Time: ",
//   Date.now() - timer,
//   "ms"
// );

// BUN impl
timer = Date.now();
const bunSha512Hash = new Bun.CryptoHasher("sha512")
  .update(message)
  .digest("hex");
console.log(
  "Bun SHA-512 Hash: ",
  bunSha512Hash,
  "Time: ",
  Date.now() - timer,
  "ms"
);

timer = Date.now();
const bunSha3_512Hash = new Bun.CryptoHasher("sha3-512")
  .update(message)
  .digest("hex");
console.log(
  "Bun SHA3-512 Hash: ",
  bunSha3_512Hash,
  "Time: ",
  Date.now() - timer,
  "ms"
);

timer = Date.now();
const bunRipemd160Hash = new Bun.CryptoHasher("ripemd160")
  .update(message)
  .digest("hex");
console.log(
  "Bun RIPEMD-160 Hash: ",
  bunRipemd160Hash,
  "Time: ",
  Date.now() - timer,
  "ms"
);

timer = Date.now();
const bunBlake2bHash = new Bun.CryptoHasher("blake2b512")
  .update(message)
  .digest("hex");
console.log(
  "Bun Blake2b Hash: ",
  bunBlake2bHash,
  "Time: ",
  Date.now() - timer,
  "ms"
);

timer = Date.now();
const bunArgon2dHash = Bun.password.hashSync(message, {
  algorithm: "argon2d",
});
console.log(
  "Bun Argon2d Hash: ",
  bunArgon2dHash,
  "Time: ",
  Date.now() - timer,
  "ms"
);

timer = Date.now();
const bunArgon2iHash = Bun.password.hashSync(message, {
  algorithm: "argon2i",
});
console.log(
  "Bun Argon2i Hash: ",
  bunArgon2iHash,
  "Time: ",
  Date.now() - timer,
  "ms"
);

timer = Date.now();
const bunArgon2idHash = Bun.password.hashSync(message, {
  algorithm: "argon2id",
});
console.log(
  "Bun Argon2id Hash: ",
  bunArgon2idHash,
  "Time: ",
  Date.now() - timer,
  "ms"
);

timer = Date.now();
const bunBcryptHash = Bun.password.hashSync(message, {
  algorithm: "bcrypt",
  cost: 10, // 4-31 (10 seems to be the recommended minimum)
});
console.log(
  "Bun Bcrypt Hash: ",
  bunBcryptHash,
  "Time: ",
  Date.now() - timer,
  "ms"
);
