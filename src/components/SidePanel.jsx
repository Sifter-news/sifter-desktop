import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon } from 'lucide-react';

const SidePanel = ({ isOpen, onClose, initialQuestion }) => {
  const [messages, setMessages] = useState([
    { type: 'user', content: initialQuestion },
    { type: 'ai', content: '...' },
  ]);
  const [newQuestion, setNewQuestion] = useState('');

  const handleAsk = () => {
    if (newQuestion.trim()) {
      setMessages([...messages, { type: 'user', content: newQuestion }, { type: 'ai', content: '...' }]);
      setNewQuestion('');
      // Here you would typically call an API to get the AI response
    }
  };

  return (
    <div className={`fixed top-0 left-0 h-full w-[480px] bg-white shadow-lg transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out flex flex-col`}>
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-semibold">AI Conversation</h2>
        <Button variant="ghost" onClick={onClose}>Close</Button>
      </div>
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div key={index} className={`p-2 rounded-lg ${message.type === 'user' ? 'bg-blue-100 ml-auto' : 'bg-gray-100'} max-w-[80%]`}>
            {message.content}
          </div>
        ))}
      </div>
      <div className="p-4 border-t">
        <div className="bg-white rounded-full shadow-lg p-2 flex items-center space-x-2 max-w-xl w-full">
          <Button size="icon" className="rounded-full flex-shrink-0 bg-[#594BFF1A] hover:bg-[#594BFF33]">
            <PlusIcon className="h-6 w-6 text-[#594BFF]" />
          </Button>
          <Input 
            type="text" 
            placeholder="Ask a follow-up question" 
            className="flex-grow text-lg border-none focus:ring-0 rounded-full"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAsk()}
          />
          <Button 
            className="bg-[#594BFF] hover:bg-[#4B3FD9] text-white rounded-full px-6"
            onClick={handleAsk}
          >
            Ask
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SidePanel;