import React from 'react';
import { MessageCircle, User } from 'lucide-react';

const ChatMessage = ({ message }) => {
  return (
    <div className={`flex gap-2 ${
      message.role === 'user' ? 'justify-end' : 'justify-start'
    }`}>
      {message.role === 'assistant' && (
        <MessageCircle className="h-6 w-6 text-purple-500" />
      )}
      <div className={`rounded-lg p-3 max-w-[80%] ${
        message.role === 'user'
          ? 'bg-purple-500 text-white'
          : message.role === 'system'
          ? 'bg-gray-100 text-gray-700'
          : 'bg-gray-100'
      }`}>
        {message.content}
      </div>
      {message.role === 'user' && (
        <User className="h-6 w-6 text-purple-500" />
      )}
    </div>
  );
};

export default ChatMessage;