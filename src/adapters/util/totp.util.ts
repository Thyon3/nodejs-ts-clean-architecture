import crypto, { BinaryToTextEncoding } from 'crypto';

/**
 * Generate a TOTP secret key
 * @returns {string} Base32 encoded secret
 */
export function generateTOTPSecret(): string {
  const buffer = crypto.randomBytes(20);
  return base32Encode(buffer);
}

/**
 * Verify a TOTP token
 * @param {string} token - The 6-digit token
 * @param {string} secret - The base32 encoded secret
 * @returns {boolean} Whether the token is valid
 */
export function verifyTOTPToken(token: string, secret: string): boolean {
  const decodedSecret = base32Decode(secret);
  const timeStep = Math.floor(Date.now() / 1000 / 30); // 30-second time steps

  // Check current time step and adjacent steps (allowing for clock drift)
  for (let i = -1; i <= 1; i++) {
    const timeBuffer = new Uint8Array(8);
    const view = new DataView(timeBuffer.buffer);
    view.setBigUint64(0, BigInt(timeStep + i), false);

    const hmac = crypto.createHmac('sha1', decodedSecret);
    hmac.update(timeBuffer);
    const hmacResult = new Uint8Array(hmac.digest());

    const offset = hmacResult[19] & 0x0f;
    const code = (
      ((hmacResult[offset] & 0x07) << 24) |
      ((hmacResult[offset + 1] & 0xff) << 16) |
      ((hmacResult[offset + 2] & 0xff) << 8) |
      (hmacResult[offset + 3] & 0xff)
    ) % 1000000;

    const formattedCode = code.toString().padStart(6, '0');

    if (formattedCode === token) {
      return true;
    }
  }

  return false;
}

/**
 * Encode buffer to base32
 * @param {Buffer} buffer - The buffer to encode
 * @returns {string} Base32 encoded string
 */
function base32Encode(buffer: Buffer): string {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let bits = 0;
  let value = 0;
  let output = '';

  for (let i = 0; i < buffer.length; i++) {
    value = (value << 8) | buffer[i];
    bits += 8;

    while (bits >= 5) {
      output += alphabet[(value >>> (bits - 5)) & 0x1f];
      bits -= 5;
    }
  }

  if (bits > 0) {
    output += alphabet[(value << (5 - bits)) & 0x1f];
  }

  return output;
}

/**
 * Decode base32 string to buffer
 * @param {string} encoded - The base32 encoded string
 * @returns {Buffer} Decoded buffer
 */
function base32Decode(encoded: string): Buffer {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let bits = 0;
  let value = 0;
  let index = 0;
  const buffer = Buffer.alloc(Math.floor(encoded.length * 5 / 8));

  for (let i = 0; i < encoded.length; i++) {
    const char = encoded[i].toUpperCase();
    const charIndex = alphabet.indexOf(char);

    if (charIndex === -1) {
      continue; // Skip padding and invalid characters
    }

    value = (value << 5) | charIndex;
    bits += 5;

    if (bits >= 8) {
      buffer[index++] = (value >>> (bits - 8)) & 0xff;
      bits -= 8;
    }
  }

  return buffer.slice(0, index);
}
