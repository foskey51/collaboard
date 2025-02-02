import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const socket = new SockJS('http://localhost:8080/ws'); // Adjust URL as needed
const stompClient = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,
    onConnect: () => {
        console.log('Connected to WebSocket');
    },
    onDisconnect: () => {
        console.log('Disconnected from WebSocket');
    },
    onStompError: (frame) => {
        console.error('Broker error: ', frame.headers['message']);
    }
});

stompClient.activate();

function joinRoom(roomId) {
    stompClient.publish({
        destination: `/app/join/${roomId}`
    });
    console.log(`Joined room ${roomId}`);
}

function leaveRoom(roomId) {
    stompClient.publish({
        destination: `/app/leave/${roomId}`
    });
    console.log(`Left room ${roomId}`);
}

function sendMessage(roomId, message) {
    const chatMessage = { content: message, sender: 'User' };
    stompClient.publish({
        destination: `/app/chat/${roomId}`,
        body: JSON.stringify(chatMessage)
    });
    console.log(`Sent message: ${message}`);
}

function subscribeToRoom(roomId) {
    stompClient.subscribe(`/user/topic/chat/${roomId}`, (message) => {
        console.log('Received:', JSON.parse(message.body));
    });
    console.log(`Subscribed to room ${roomId}`);
}

// Example usage
setTimeout(() => {
    const roomId = '123';
    joinRoom(roomId);
    subscribeToRoom(roomId);
    setTimeout(() => sendMessage(roomId, 'Hello from JS!'), 2000);
    setTimeout(() => leaveRoom(roomId), 5000);
}, 3000);
