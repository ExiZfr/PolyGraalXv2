import { FastifyInstance } from 'fastify';
import { redisSub, REDIS_CHANNELS } from '../config/redis';

interface WebSocketClient {
    socket: WebSocket;
    subscriptions: Set<string>;
}

const clients = new Map<string, WebSocketClient>();

/**
 * Register WebSocket handlers for real-time updates
 */
export async function registerWebSocket(server: FastifyInstance): Promise<void> {
    // WebSocket endpoint
    server.get('/ws', { websocket: true }, (socket, req) => {
        const clientId = crypto.randomUUID();

        clients.set(clientId, {
            socket: socket as unknown as WebSocket,
            subscriptions: new Set(),
        });

        console.log(`🔌 WebSocket client connected: ${clientId}`);

        // Handle incoming messages
        socket.on('message', (data: Buffer) => {
            try {
                const message = JSON.parse(data.toString());
                handleClientMessage(clientId, message);
            } catch (error) {
                console.error('Invalid WebSocket message:', error);
            }
        });

        // Handle disconnection
        socket.on('close', () => {
            clients.delete(clientId);
            console.log(`🔌 WebSocket client disconnected: ${clientId}`);
        });

        // Send welcome message
        socket.send(JSON.stringify({
            type: 'CONNECTED',
            clientId,
            timestamp: Date.now(),
        }));
    });

    // Subscribe to Redis channels
    await subscribeToRedisChannels();
}

/**
 * Handle messages from WebSocket clients
 */
function handleClientMessage(clientId: string, message: any): void {
    const client = clients.get(clientId);
    if (!client) return;

    switch (message.type) {
        case 'SUBSCRIBE':
            if (message.channel) {
                client.subscriptions.add(message.channel);
                client.socket.send(JSON.stringify({
                    type: 'SUBSCRIBED',
                    channel: message.channel,
                }));
            }
            break;

        case 'UNSUBSCRIBE':
            if (message.channel) {
                client.subscriptions.delete(message.channel);
                client.socket.send(JSON.stringify({
                    type: 'UNSUBSCRIBED',
                    channel: message.channel,
                }));
            }
            break;

        case 'PING':
            client.socket.send(JSON.stringify({ type: 'PONG' }));
            break;
    }
}

/**
 * Subscribe to Redis pub/sub channels and forward to WebSocket clients
 */
async function subscribeToRedisChannels(): Promise<void> {
    const channels = Object.values(REDIS_CHANNELS);

    for (const channel of channels) {
        await redisSub.subscribe(channel);
    }

    redisSub.on('message', (channel: string, message: string) => {
        // Broadcast to all subscribed clients
        for (const [clientId, client] of clients) {
            if (client.subscriptions.has(channel) || client.subscriptions.has('*')) {
                try {
                    client.socket.send(message);
                } catch (error) {
                    console.error(`Failed to send to client ${clientId}:`, error);
                    clients.delete(clientId);
                }
            }
        }
    });

    console.log(`📡 Subscribed to Redis channels: ${channels.join(', ')}`);
}

export { clients };
