import { FastifyRequest, FastifyReply } from 'fastify';
import { verifyMessage } from 'viem';

interface AuthUser {
    address: string;
}

declare module 'fastify' {
    interface FastifyRequest {
        user?: AuthUser;
    }
}

/**
 * Authentication middleware using wallet signature verification
 * Expects Authorization header: Bearer <address>:<signature>:<message>
 */
export async function authMiddleware(
    request: FastifyRequest,
    reply: FastifyReply
): Promise<void> {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        // Allow unauthenticated access for some routes
        // Individual routes can check request.user
        return;
    }

    try {
        const token = authHeader.slice(7); // Remove 'Bearer '
        const [address, signature, message] = token.split(':');

        if (!address || !signature || !message) {
            return reply.status(401).send({
                success: false,
                error: 'Invalid authentication token format',
            });
        }

        // Verify the signature matches the address
        const valid = await verifyMessage({
            address: address as `0x${string}`,
            message: decodeURIComponent(message),
            signature: signature as `0x${string}`,
        });

        if (!valid) {
            return reply.status(401).send({
                success: false,
                error: 'Invalid signature',
            });
        }

        // Check message timestamp (prevent replay attacks)
        const messageData = JSON.parse(decodeURIComponent(message));
        const timestamp = messageData.timestamp;
        const now = Date.now();
        const fiveMinutes = 5 * 60 * 1000;

        if (!timestamp || now - timestamp > fiveMinutes) {
            return reply.status(401).send({
                success: false,
                error: 'Authentication expired',
            });
        }

        // Attach user to request
        request.user = { address: address.toLowerCase() };
    } catch (error) {
        return reply.status(401).send({
            success: false,
            error: 'Authentication failed',
        });
    }
}
