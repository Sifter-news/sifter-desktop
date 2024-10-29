import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, User, X, Upload, Paperclip } from 'lucide-react';
import { toast } from "sonner";

const AIChatPanel = ({ isOpen, onClose, initialContext }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (initialContext) {
      setMessages([
        {
          role: 'system',
          content: `Context: ${initialContext}`
        }
      ]);
    }
  }, [initialContext]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setMessages(prev => [...prev, {
        role: 'system',
        content: `File attached: ${file.name}`
      }]);
      toast.success(`File "${file.name}" attached successfully`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() && !selectedFile) return;

    const newMessages = [];
    
    if (input.trim()) {
      newMessages.push({
        role: 'user',
        content: input
      });
    }

    setMessages(prev => [...prev, ...newMessages]);
    setInput('');
    setSelectedFile(null);
    fileInputRef.current.value = '';

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'This is a simulated AI response. Replace with actual API integration.'
      }]);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-[72px] right-8 bottom-8 w-[360px] bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-blue-500" />
          <h2 className="font-semibold">AI Assistant</h2>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-2 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role === 'assistant' && (
                <Bot className="h-6 w-6 text-blue-500" />
              )}
              <div
                className={`rounded-lg p-3 max-w-[80%] ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : message.role === 'system'
                    ? 'bg-gray-100 text-gray-700'
                    : 'bg-gray-100'
                }`}
              >
                {message.content}
              </div>
              {message.role === 'user' && (
                <User className="h-6 w-6 text-blue-500" />
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => fileInputRef.current.click()}
            className="flex-shrink-0"
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button type="submit">Send</Button>
        </div>
        {selectedFile && (
          <div className="mt-2 text-sm text-gray-500 flex items-center gap-2">
            <Paperclip className="h-3 w-3" />
            {selectedFile.name}
          </div>
        )}
      </form>
    </div>
  );
};

export default AIChatPanel;