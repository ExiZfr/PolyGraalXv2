import { FastifyError, FastifyRequest, FastifyReply } from 'fastify';

/**
 * Global error handler for consistent error responses
 */
export function errorHandler(
    error: FastifyError,
    request: FastifyRequest,
    reply: FastifyReply
): void {
    request.log.error(error);

    // Handle validation errors
    if (error.validation) {
        reply.status(400).send({
            success: false,
            error: 'Validation error',
            details: error.validation,
        });
        return;
    }

    // Handle rate limiting
    if (error.statusCode === 429) {
        reply.status(429).send({
            success: false,
            error: 'Too many requests. Please try again later.',
        });
        return;
    }

    // Handle not found
    if (error.statusCode === 404) {
        reply.status(404).send({
            success: false,
            error: 'Resource not found',
        });
        return;
    }

    // Default error response
    const statusCode = error.statusCode || 500;
    const message = statusCode === 500
        ? 'Internal server error'
        : error.message;

    reply.status(statusCode).send({
        success: false,
        error: message,
    });
}
