"use client";
import Chatbot from "@/section/Chatbot";
import ChatbotNew from "@/section/ChatbotNew";
import useAuth from "@/Utils/Hooks/useAuth";

export default function Home() {
  const { domainData } = useAuth();
  return <>{domainData?.isBot ? <Chatbot /> : <ChatbotNew />}</>;
}
