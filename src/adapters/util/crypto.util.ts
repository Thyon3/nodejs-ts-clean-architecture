// module imports
import crypto from 'crypto';

export default class CryptoUtil {
    public static verifyHmac(hmac: string, hash: string): boolean {
        const providedHmac = Buffer.from(hmac, 'utf-8');
        const generatedHmac = Buffer.from(hash, 'utf-8');

        let hashEquals = false;
        // timingSafeEqual will prevent any timing attacks. arguments must be buffers
        try {
            hashEquals = crypto.timingSafeEqual(generatedHmac, providedHmac);
        } catch (error) {
            hashEquals = false;
        }
        return hashEquals;
    }
}
