import type { ClientRequestArgs } from 'node:http';

import WebSocket from 'ws';

export function createWebSocket(url: string, options?: ClientRequestArgs | WebSocket.ClientOptions) {
    return new WebSocket(url, options);
}
