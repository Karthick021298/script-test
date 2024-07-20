import React from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./src/Utils/Contexts/AuthContext";
import Chatbot from "./src/section/Chatbot";

const renderChatbot = (containerId, domain) => {
  const container = document.getElementById(containerId);
  if (container && domain) {
    const root = createRoot(container);
    root.render(
      <AuthProvider domain={domain}>
        <Chatbot />
      </AuthProvider>
    );
    console.log(`Chatbot rendered in container: ${containerId} with domain: ${domain}`);
  } else {
    console.error(`Container with id ${containerId} not found.`);
  }
};

// Expose the renderChatbot function globally
window.renderChatbot = renderChatbot;

console.log("chatbot.bundle.js script loaded");
console.log('Environment Variables:', {
  apiProfile: process.env.NEXT_PUBLIC_API_PROFILE,
  headerAccess: process.env.NEXT_PUBLIC_HEADER_ACCESS,
  secretKey: process.env.NEXT_PUBLIC_SECRET_KEY,
});

window.onload = function () {
  if (typeof window.renderChatbot === 'function') {
    window.renderChatbot('chatbot-container', process.env.NEXT_PUBLIC_API_PROFILE); // Use env variable here
  } else {
    console.error('renderChatbot function is not defined.');
  }
};
