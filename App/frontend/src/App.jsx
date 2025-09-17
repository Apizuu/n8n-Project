import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { Send, Menu } from 'lucide-react';
import Sidebar from './components/Sidebar';
import './App.css';

const GeminiIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="gemini-icon"
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4a6 6 0 1 1 0 12 6 6 0 0 1 0-12z" />
    <path d="M12 2a10 10 0 0 0-4 17.32M12 2a10 10 0 0 1 4 17.32M2 12h20M12 2v20" />
  </svg>
);

// 🔥 Komponen bubble loading (3 titik animasi)
const LoadingBubble = () => (
  <div className="message message-bot">
    <div className="message-bubble message-bubble-bot">
      <div className="loading-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  </div>
);

const App = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const [isLoading, setIsLoading] = useState(false); // 👈 state loading
  const messagesEndRef = useRef(null);

  const n8nBaseUrl = import.meta.env.VITE_N8N_BASE_URL;

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { text: input, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);

    const originalInput = input;
    setInput('');

    // Tampilkan bubble loading
    setIsLoading(true);

    try {
      const webhookUrl = `${n8nBaseUrl}/webhook-test/test-webhook`;
      const requestBody = { message: originalInput };

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Kesalahan jaringan: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();

      const jsonString = JSON.stringify(result);
      const match = jsonString.match(/"output"\s*:\s*"([^"]*)"/);

      let botResponseText = match ? match[1].replace(/\\n/g, '\n') : "Maaf, tidak ada output valid.";
      botResponseText = botResponseText.replace(/<think>[\s\S]*?<\/think>/g, '').trim();

      const botResponse = { text: botResponseText, sender: 'bot' };

      // Tambah pesan bot, hilangkan loading
      setMessages((prev) => [...prev, botResponse]);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data from API:', error);
      const errorMessage = { text: "Terjadi kesalahan saat memuat balasan.", sender: 'bot' };
      setMessages((prev) => [...prev, errorMessage]);
      setIsLoading(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="app-container" data-theme={theme}>
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        theme={theme}
        toggleSidebar={toggleSidebar}
        toggleTheme={toggleTheme}
      />

      <main className="main-content">
        <button onClick={toggleSidebar} className="mobile-toggle-btn">
          <Menu size={20} />
        </button>

        <div className="chat-area">
          <div className="chat-content">
            {messages.length === 0 ? (
              <div className="welcome-message">
                <GeminiIcon />
                <h1>Halo, bagaimana saya bisa membantu Anda hari ini?</h1>
                <p>Saya terhubung ke node n8n Anda. Tanyakan sesuatu kepada saya!</p>
              </div>
            ) : (
              <div className="message-list">
                {messages.map((msg, index) => (
                  <div key={index} className={`message message-${msg.sender}`}>
                    <div className={`message-bubble message-bubble-${msg.sender}`}>
                      <pre style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</pre>
                    </div>
                  </div>
                ))}
                {/* 👇 Tampilkan bubble loading kalau masih nunggu */}
                {isLoading && <LoadingBubble />}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        <div className="input-area">
          <form onSubmit={handleSendMessage} className="input-form">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="input-textarea"
              rows="1"
              placeholder="Ketik pesan di sini..."
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
            />
            <button
              type="submit"
              className={`send-btn ${input.trim() ? 'active' : ''}`}
              disabled={!input.trim()}
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default App;

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
