import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendIcon } from 'lucide-react';

const AISidePanel = ({ isOpen, onClose, initialQuestion, onSendMessage }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (initialQuestion) {
      setMessages([{ type: 'user', content: initialQuestion }]);
      // Simulate AI response (replace with actual API call in production)
      setTimeout(() => {
        setMessages(prevMessages => [...prevMessages, { type: 'ai', content: `Here's a response to "${initialQuestion}"` }]);
      }, 1000);
    }
  }, [initialQuestion]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (newMessage.trim()) {
      setMessages(prevMessages => [...prevMessages, { type: 'user', content: newMessage }]);
      onSendMessage(newMessage);
      setNewMessage('');
      // Simulate AI response (replace with actual API call in production)
      setTimeout(() => {
        setMessages(prevMessages => [...prevMessages, { type: 'ai', content: `Here's a response to "${newMessage}"` }]);
      }, 1000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 right-0 h-full w-[480px] bg-white shadow-lg flex flex-col">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-semibold">AI Conversation</h2>
        <Button variant="ghost" onClick={onClose}>Close</Button>
      </div>
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-3 rounded-lg max-w-[80%] ${
              message.type === 'user' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-800'
            }`}>
              {message.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t">
        <div className="flex items-center space-x-2">
          <Input 
            type="text" 
            placeholder="Type your message..." 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <Button onClick={handleSend}>
            <SendIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AISidePanel;