import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { Send, MessageSquare, Bot, User, HelpCircle, Loader2 } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

interface ChatbotProps {
  theme?: 'light' | 'dark';
}

export const Chatbot: React.FC<ChatbotProps> = ({ theme = 'dark' }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'bot',
      text: "Hello! I am your WealthMap AI Assistant. How can I help you analyze your income, expenses, and savings goals today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll chat to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessageText = inputText.trim();
    setInputText('');
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: userMessageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsSending(true);

    try {
      // Connect to dummy endpoints: POST /chat
      const response = await api.post('/chat', { message: userMessageText });
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: response.data.reply || "I've reviewed your wealth maps and suggest maintaining a 20% savings buffer based on current expense projections.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.warn('Backend server not active. Simulating mock chatbot response...', err);
      // Simulate artificial delay
      setTimeout(() => {
        let botText = "I've received your query. Based on your current income of $6,550 and monthly expenses of $1,855, your savings rate is at a strong 71.7%. I recommend allocating an extra 5% to your Emergency Fund goal.";
        
        if (userMessageText.toLowerCase().includes('help')) {
          botText = "You can ask me questions like: 'How is my net worth compounding?', 'What is my budget burn pace?', or 'Suggest asset rebalancing splits.'";
        } else if (userMessageText.toLowerCase().includes('hello') || userMessageText.toLowerCase().includes('hi')) {
          botText = "Hi there! Ready to optimize your compound interest metrics? Let me know what financial pathways you are curious about.";
        }

        const botMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: botText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, botMessage]);
        setIsSending(false);
      }, 1000);
      return;
    }
    
    setIsSending(false);
  };

  const samplePrompts = [
    "Analyze my budget burn rate",
    "How can I hit my Coast FIRE goal faster?",
    "Suggest portfolio rebalancing models"
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-210px)] min-h-[500px]">
      
      {/* Left Chat Screen */}
      <div className="lg:col-span-8 flex flex-col justify-between h-full">
        <div className={`flex-1 p-6 rounded-2xl border overflow-y-auto flex flex-col gap-4 ${
          theme === 'dark' ? 'bg-[#0d1220] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          
          {messages.map((m) => {
            const isBot = m.sender === 'bot';
            return (
              <div 
                key={m.id}
                className={`flex gap-3 max-w-[85%] ${
                  isBot ? 'self-start text-left' : 'self-end flex-row-reverse text-right'
                }`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center ${
                  isBot 
                    ? theme === 'dark' ? 'bg-indigo-950 text-indigo-400 border border-indigo-800/40' : 'bg-indigo-50 text-indigo-600'
                    : 'bg-brand-blue text-white'
                }`}>
                  {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                <div className="space-y-1">
                  <div className={`p-3.5 rounded-2xl text-xs leading-relaxed font-medium ${
                    isBot
                      ? theme === 'dark' ? 'bg-slate-900/60 border border-slate-800/50 text-slate-200' : 'bg-slate-100 text-slate-800'
                      : 'bg-brand-blue text-white'
                  }`}>
                    {m.text}
                  </div>
                  <p className="text-[9px] font-semibold text-slate-500 font-mono px-1">
                    {m.timestamp}
                  </p>
                </div>
              </div>
            );
          })}

          {isSending && (
            <div className="flex gap-3 self-start text-left">
              <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center ${
                theme === 'dark' ? 'bg-indigo-950 text-indigo-400 border border-indigo-800/40' : 'bg-indigo-50 text-indigo-600'
              }`}>
                <Bot className="w-4 h-4" />
              </div>
              <div className={`p-3.5 rounded-2xl text-xs flex items-center gap-2 ${
                theme === 'dark' ? 'bg-slate-900/60 text-slate-400 border border-slate-800/50' : 'bg-slate-100 text-slate-500'
              }`}>
                <Loader2 className="w-4.5 h-4.5 animate-spin text-brand-blue" />
                WealthMap AI is thinking...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input box */}
        <form onSubmit={handleSend} className="mt-4 flex gap-3">
          <input
            type="text"
            placeholder="Type financial questions... (e.g. 'Help me balance my savings')"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isSending}
            className={`flex-1 px-4 py-3.5 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-brand-blue/35 transition-all ${
              theme === 'dark'
                ? 'bg-[#0d1220] border-slate-800 text-white focus:border-brand-blue'
                : 'bg-white border-slate-200 text-slate-900 focus:border-brand-blue shadow-sm'
            }`}
          />
          <button
            type="submit"
            disabled={isSending || !inputText.trim()}
            className="px-6 bg-brand-blue hover:bg-blue-600 disabled:bg-slate-700 text-white font-bold rounded-xl flex items-center justify-center transition-all shadow-md shadow-brand-blue/10 transform active:scale-95"
          >
            <Send className="w-4.5 h-4.5" />
          </button>
        </form>
      </div>

      {/* Right Suggestions screen */}
      <div className="lg:col-span-4 hidden lg:flex flex-col gap-6">
        <div className={`p-6 rounded-2xl border text-left flex flex-col justify-between h-full ${
          theme === 'dark' ? 'bg-[#0d1220] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="space-y-6">
            <div className="flex items-center gap-2.5">
              <HelpCircle className="w-5 h-5 text-indigo-400" />
              <h3 className="font-bold text-sm">Suggested Topics</h3>
            </div>
            
            <p className="text-xs text-slate-500 leading-relaxed">
              Ask questions regarding budgeting, investment metrics, or target paths. Click any prompt to auto-fill.
            </p>

            <div className="flex flex-col gap-2.5">
              {samplePrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setInputText(prompt)}
                  className={`p-3 text-xs font-semibold text-left rounded-xl border transition-all ${
                    theme === 'dark'
                      ? 'bg-slate-950/40 border-slate-800 hover:bg-slate-900/50 hover:border-slate-700 text-slate-300'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100/50 text-slate-700'
                  }`}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          <div className={`p-4 rounded-xl border ${
            theme === 'dark' ? 'bg-slate-950/40 border-slate-800/60' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className="text-[10px] uppercase font-bold text-slate-500">Security Architecture</span>
            <p className="text-[9px] text-slate-400 mt-1 leading-normal">
              AI sessions compile metadata anonymously. Financial logs are encrypted using keys managed in hardware modules.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Chatbot;
