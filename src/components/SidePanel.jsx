import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon, SendIcon } from 'lucide-react';

const SidePanel = ({ isOpen, onClose, messages, setMessages, initialQuestion }) => {
  const [newQuestion, setNewQuestion] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleAsk = () => {
    if (newQuestion.trim()) {
      setMessages([...messages, { type: 'user', content: newQuestion }]);
      setNewQuestion('');
      // Simulate AI response (replace with actual API call in production)
      setTimeout(() => {
        setMessages(prevMessages => [...prevMessages, { type: 'ai', content: `Here's a response to "${newQuestion}"` }]);
      }, 1000);
    }
  };

  return (
    <div className={`fixed top-0 right-0 h-full w-[400px] bg-white shadow-lg transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out flex flex-col`}>
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-semibold">AI Conversation</h2>
        <Button variant="ghost" onClick={onClose}>Close</Button>
      </div>
      <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-3 rounded-lg max-w-[80%] ${
              message.type === 'user' 
                ? 'bg-blue-500 text-white' 
                : 'bg-white text-gray-800 border border-gray-200'
            }`}>
              {message.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t bg-white">
        <div className="flex items-center space-x-2">
          <Input 
            type="text" 
            placeholder="Type your message..." 
            className="flex-grow"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAsk()}
          />
          <Button 
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2"
            onClick={handleAsk}
          >
            <SendIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SidePanel;