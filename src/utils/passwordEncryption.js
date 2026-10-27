import { API_BASE_URL } from "./constants";

const HKDF_INFO = new TextEncoder().encode("cycle-sense-password-payload-v1");

function encodeBase64Url(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export async function encryptCredentialPayload(secretFields) {
  const challengeResponse = await fetch(`${API_BASE_URL}/auth/encryption-challenge`, {
    credentials: "same-origin",
    cache: "no-store",
  });
  if (!challengeResponse.ok) {
    throw new Error("Could not prepare secure credential submission.");
  }

  const challenge = await challengeResponse.json();
  const clientKeys = await crypto.subtle.generateKey(
    { name: "ECDH", namedCurve: "P-256" },
    true,
    ["deriveBits"],
  );
  const serverPublicKey = await crypto.subtle.importKey(
    "jwk",
    challenge.public_key,
    { name: "ECDH", namedCurve: "P-256" },
    false,
    [],
  );
  const sharedSecret = await crypto.subtle.deriveBits(
    { name: "ECDH", public: serverPublicKey },
    clientKeys.privateKey,
    256,
  );
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const hkdfKey = await crypto.subtle.importKey("raw", sharedSecret, "HKDF", false, ["deriveKey"]);
  const encryptionKey = await crypto.subtle.deriveKey(
    { name: "HKDF", hash: "SHA-256", salt, info: HKDF_INFO },
    hkdfKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt"],
  );
  const publicKey = await crypto.subtle.exportKey("jwk", clientKeys.publicKey);
  const ciphertext = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
      additionalData: new TextEncoder().encode(challenge.challenge),
    },
    encryptionKey,
    new TextEncoder().encode(JSON.stringify(secretFields)),
  );

  return {
    expiresAt: challenge.expires_at * 1000,
    payload: {
      challenge: challenge.challenge,
      ephemeral_public_key: publicKey,
      salt: encodeBase64Url(salt),
      iv: encodeBase64Url(iv),
      ciphertext: encodeBase64Url(new Uint8Array(ciphertext)),
    },
  };
}
