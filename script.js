import React from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./src/Utils/Contexts/AuthContext";
import Chatbot from "./src/section/Chatbot";
import ChatbotNew from "./src/section/ChatbotNew";

const renderChatbot = (containerId, domain) => {
  const container = document.getElementById(containerId);
  if (container && domain) {
    const root = createRoot(container);
    root.render(
      <AuthProvider domain={domain}>
        <Chatbot />
        <ChatbotNew />
      </AuthProvider>
    );
    console.log(
      `Chatbot rendered in container: ${containerId} with domain: ${domain}`
    );
  } else {
    console.error(`Container with id ${containerId} not found.`);
  }
};

// Expose the renderChatbot function globally
window.renderChatbot = renderChatbot;

console.log("chatbot.bundle.js script loaded");

window.onload = function () {
  if (typeof window.renderChatbot === "function") {
    window.renderChatbot("chatbot-container");
    console.error("renderChatbot function is not defined.");
  }
};
