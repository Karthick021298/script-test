import React from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './src/Utils/Contexts/AuthContext';
import Chatbot from './src/section/Chatbot';

const renderChatbot = (containerId) => {
    const container = document.getElementById(containerId);
    if (container) {
        const root = createRoot(container);
        root.render(
            <AuthProvider>
                <Chatbot />
            </AuthProvider>
        );
        console.log(`Chatbot rendered in container: ${containerId}`);
    } else {
        console.error(`Container with id ${containerId} not found.`);
    }
};

// Expose the renderChatbot function globally
window.renderChatbot = renderChatbot;

console.log('chatbot.bundle.js script loaded');

window.onload = function() {
    if (typeof window.renderChatbot === 'function') {
        window.renderChatbot('chatbot-container'); // Pass the container ID
    } else {
        console.error('renderChatbot function is not defined.');
    }
};