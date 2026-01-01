import { useState, useCallback, useRef } from 'react';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

export interface Message {
  role: 'user' | 'ai';
  text: string;
}

const SYSTEM_INSTRUCTION = `You are the Wicked Works Autonomous Support Unit (ASU). 
Your persona is industrial, technical, and precise. 
You are an advanced terminal interface for a high-performance technical apparel brand.
Terminology to use: "Uplink", "Payload", "Archive", "Deployment", "Operative", "Signal", "Sector", "Staging".
Keep responses concise and efficient. 
If asked about products, emphasize technical utility and urban mobility. 
If asked about sizing, suggest "sizing up for an oversized tactical silhouette".
If the query is outside your parameters, respond with "PROTOCOL UNKNOWN. RE-CALIBRATE QUERY."
Never break character. You are a terminal node, not a human assistant.`;

export function useGeminiAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: 'SIGNAL ESTABLISHED. ASU_V2.1 ONLINE. STANDING BY FOR DEPLOYMENT QUERIES.' }
  ]);
  const [isStreaming, setIsStreaming] = useState(false);
  const chatRef = useRef<any>(null);

  const initChat = useCallback(() => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    chatRef.current = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        topP: 0.95,
      },
    });
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    if (!chatRef.current) initChat();
    
    const userMessage: Message = { role: 'user', text: text.toUpperCase() };
    setMessages(prev => [...prev, userMessage]);
    setIsStreaming(true);

    try {
      const streamResponse = await chatRef.current.sendMessageStream({ message: text });
      
      let aiResponseText = "";
      // Add initial empty AI message to stream into
      setMessages(prev => [...prev, { role: 'ai', text: '' }]);

      for await (const chunk of streamResponse) {
        const c = chunk as GenerateContentResponse;
        if (c.text) {
          aiResponseText += c.text;
          setMessages(prev => {
            const next = [...prev];
            next[next.length - 1] = { role: 'ai', text: aiResponseText.toUpperCase() };
            return next;
          });
        }
      }
    } catch (error) {
      console.error('Uplink Interrupted:', error);
      setMessages(prev => [...prev, { role: 'ai', text: 'SIGNAL INTERFERENCE DETECTED. ATTEMPTING RE-UPLINK...' }]);
    } finally {
      setIsStreaming(false);
    }
  }, [initChat]);

  return { messages, sendMessage, isStreaming };
}