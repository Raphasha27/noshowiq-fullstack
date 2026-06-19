'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'ai';
    time: string;
}

export default function AIChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: "Hello! I'm the NoShowIQ Assistant. Ask me about appointment attendance predictions, scheduling risk, or revenue optimization.", sender: 'ai', time: 'Just now' }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = () => {
        if (!inputValue.trim()) return;

        const userMsg: Message = {
            id: Date.now(),
            text: inputValue,
            sender: 'user',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMsg]);
        setInputValue("");
        setIsTyping(true);

        // Simulate AI processing
        setTimeout(() => {
            let responseText = "I'm not sure about that specific detail yet.";
            const lowerInput = userMsg.text.toLowerCase();

            if (lowerInput.includes("sandton") || lowerInput.includes("specialist")) {
                responseText = "Sandton Specialist Medical Centre has **3 appointments flagged as High Risk** of no-show today (Dr. Ndlovu and Dr. Patel). Auto-reminders have been dispatched, and waitlist auto-fill is on standby.";
            } else if (lowerInput.includes("revenue") || lowerInput.includes("billing") || lowerInput.includes("loss")) {
                responseText = "Average recovered revenue this week is **R14,800** by auto-filling 4 canceled slots. Active risk monitoring has saved R42,500 this month.";
            } else if (lowerInput.includes("reminders") || lowerInput.includes("sms") || lowerInput.includes("whatsapp")) {
                responseText = "Smart conversational reminders have a **92% confirmation rate**. High-risk slots are automatically sent interactive cancel/reschedule buttons.";
            } else if (lowerInput.includes("gauteng") || lowerInput.includes("rosebank")) {
                responseText = "Rosebank Medical Suites currently shows an average **96.2% attendance rate**. No immediate no-show actions required for today's remaining slots.";
            } else if (lowerInput.includes("western cape") || lowerInput.includes("cape town")) {
                responseText = "Cape Town Specialist Centre (Cardiology) has **1 medium-risk slot** at 11:15 AM (Dr. Venter). Standard SMS reminder confirmed.";
            } else if (lowerInput.includes("waitlist") || lowerInput.includes("auto-fill")) {
                responseText = "Waitlist Auto-Fill has 14 opt-in patients ready to claim empty slots. Average matching time for a canceled slot is **8.2 minutes**.";
            } else {
                responseText = "I can help you track attendance and protect revenue across your practices. Try asking about Sandton, Cape Town, smart reminders, or waitlist auto-fill.";
            }

            const aiMsg: Message = {
                id: Date.now() + 1,
                text: responseText,
                sender: 'ai',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            setMessages(prev => [...prev, aiMsg]);
            setIsTyping(false);
        }, 1500);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSend();
    };

    return (
        <>
            {/* Floating Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 ${isOpen ? 'bg-rose-500 rotate-90' : 'bg-gradient-to-r from-blue-600 to-cyan-500'}`}
            >
                {isOpen ? <X className="w-6 h-6 text-white" /> : <Bot className="w-8 h-8 text-white" />}
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse border-2 border-white"></span>
                )}
            </button>

            {/* Chat Window */}
            <div className={`fixed bottom-24 right-6 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden transform transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}>
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-sm">NoShowIQ Assistant</h3>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                            <span className="text-blue-100 text-xs">Online • 94.8% Accuracy</span>
                        </div>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="h-80 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] rounded-2xl p-3 shadow-sm ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'}`}>
                                <p className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></p>
                                <p className={`text-[10px] mt-1 text-right ${msg.sender === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>{msg.time}</p>
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="bg-white border border-gray-100 rounded-2xl p-3 rounded-tl-none flex gap-1 items-center shadow-sm">
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-3 bg-white border-t border-gray-100">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ask about practice status or revenue..."
                            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!inputValue.trim()}
                            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-xl transition-colors shadow-lg shadow-blue-200"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

