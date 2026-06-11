import React, { useState, useEffect, useRef } from 'react';
import { BsChatDotsFill, BsXLg, BsSendFill } from 'react-icons/bs';
import axios from 'axios';
import '../css/ChatBot.css';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showBubble, setShowBubble] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', text: 'Hello! I am eBanka assistant. How can I help you today?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const showTimer = setTimeout(() => setShowBubble(true), 2000);
        const hideTimer = setTimeout(() => setShowBubble(false), 7500);
        return () => {
            clearTimeout(showTimer);
            clearTimeout(hideTimer);
        };
    }, []);

    useEffect(() => {
        if (isOpen && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen]);

    const handleIconClick = () => {
        setIsOpen(prev => !prev);
        setShowBubble(false);
    };

    const sendMessage = async () => {
        const text = input.trim();
        if (!text || loading) return;

        const userMessage = { role: 'user', text };
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setInput('');
        setLoading(true);

        try {
            const history = updatedMessages.map(m => ({
                role: m.role,
                content: m.text
            }));

            const token = window.sessionStorage.getItem('user_auth_token');
            const res = await axios.post('http://127.0.0.1:8000/api/chat', {
                message: text,
                history: history.slice(0, -1)
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setMessages(prev => [...prev, { role: 'model', text: res.data.reply }]);
        } catch (err) {
            setMessages(prev => [...prev, {
                role: 'assistant',
                text: 'Sorry, I am unable to respond right now. Please try again later.'
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <>
            {isOpen && (
                <div className="chatbot-panel">
                    <div className="chatbot-header">
                        <span>eBanka Assistant</span>
                        <button className="chatbot-close-btn" onClick={handleIconClick}>
                            <BsXLg />
                        </button>
                    </div>

                    <div className="chatbot-messages">
                        {messages.map((msg, i) => (
                            <div key={i} className={`chatbot-message ${msg.role === 'user' ? 'chatbot-message--user' : 'chatbot-message--assistant'}`}>
                                {msg.text}
                            </div>
                        ))}
                        {loading && (
                            <div className="chatbot-message chatbot-message--assistant chatbot-typing">
                                <span /><span /><span />
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="chatbot-input-row">
                        <input
                            className="chatbot-input"
                            type="text"
                            placeholder="Type your message..."
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={loading}
                        />
                        <button
                            className="chatbot-send-btn"
                            onClick={sendMessage}
                            disabled={loading || !input.trim()}
                        >
                            <BsSendFill />
                        </button>
                    </div>
                </div>
            )}

            {!isOpen && (
                <div className="chatbot-icon-wrapper">
                    {showBubble && (
                        <div className="chatbot-bubble">
                            Ja sam Vaš AI asistent
                            i tu sam ukoliko Vam je potrebna bilo kakva pomoć
                        </div>
                    )}
                    <button className="chatbot-icon" onClick={handleIconClick} aria-label="Open chat">
                        <BsChatDotsFill />
                    </button>
                </div>
            )}
        </>
    );
};

export default ChatBot;
