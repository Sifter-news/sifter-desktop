import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendIcon, PlusIcon } from 'lucide-react';

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
    <div className="fixed top-0 right-0 h-full w-[480px] bg-white shadow-lg flex flex-col z-20 m-4 rounded-2xl">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-semibold">AI Conversation</h2>
        <Button variant="ghost" onClick={onClose}>Close</Button>
      </div>
      <div className="flex-grow overflow-hidden p-4">
        <div className="bg-gray-100 h-full rounded-2xl p-4 overflow-y-auto">
          <div className="space-y-4">
            {/* Example chat bubble */}
            <div className="flex justify-start">
              <div className="p-3 rounded-lg max-w-[80%] bg-white text-gray-800 border border-gray-300">
                Example chat bubble
              </div>
            </div>
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-3 rounded-lg max-w-[80%] ${
                  message.type === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white text-gray-800 border border-gray-300'
                }`}>
                  {message.content}
                </div>
              </div>
            ))}
            {/* Link to input field text */}
            {newMessage && (
              <div className="flex justify-end">
                <div className="p-3 rounded-lg max-w-[80%] bg-blue-500 text-white">
                  {newMessage}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>
      <div className="p-4 border-t">
        <div className="flex items-center space-x-2">
          <div className="bg-white rounded-full shadow-lg p-2 flex items-center space-x-2 flex-grow">
            <Button size="icon" className="rounded-full flex-shrink-0 bg-[#594BFF1A] hover:bg-[#594BFF33]">
              <PlusIcon className="h-6 w-6 text-[#594BFF]" />
            </Button>
            <Input 
              type="text" 
              placeholder="Type your message..." 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              className="flex-grow text-lg border-none focus:ring-0 rounded-full"
            />
            <Button 
              className="bg-[#594BFF] hover:bg-[#4B3FD9] text-white rounded-full px-6"
              onClick={handleSend}
            >
              Ask
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISidePanel;