/** PBKDF2 password hashing (Web Crypto) — SPA-side only; migrate to backend for production hardening */

function buffToB64(buffer) {
  const bytes = new Uint8Array(buffer);
  let s = '';
  for (let i = 0; i < bytes.byteLength; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s);
}

function b64ToBuff(b64) {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out.buffer.slice(out.byteOffset, out.byteOffset + out.byteLength);
}

function timingSafeEqualBuf(aRaw, bRaw) {
  const a = new Uint8Array(aRaw instanceof ArrayBuffer ? aRaw : aRaw.buffer);
  const b = new Uint8Array(bRaw instanceof ArrayBuffer ? bRaw : bRaw.buffer);
  if (a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a[i] ^ b[i];
  return d === 0;
}

export async function hashPassword(plainPassword) {
  const enc = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(plainPassword), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: 150_000, hash: 'SHA-256' },
    keyMaterial,
    256,
  );
  const saltSlice = salt.buffer.slice(salt.byteOffset, salt.byteOffset + salt.byteLength);
  return {
    salt_b64: buffToB64(saltSlice),
    hash_b64: buffToB64(bits),
  };
}

export async function verifyPassword(plainPassword, saltB64, hashB64) {
  const enc = new TextEncoder();
  const salt = new Uint8Array(b64ToBuff(saltB64));
  const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(plainPassword), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: 150_000, hash: 'SHA-256' },
    keyMaterial,
    256,
  );
  return timingSafeEqualBuf(bits, b64ToBuff(hashB64));
}

export function randomDigits(len = 6) {
  let s = '';
  for (let i = 0; i < len; i++) {
    const x = crypto.getRandomValues(new Uint8Array(1))[0];
    s += String(x % 10);
  }
  return s;
}
