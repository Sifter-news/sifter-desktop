import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/supabase';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { processMessage } from '@/utils/chatUtils';

const AIChatPanel = ({ isOpen, onClose, initialContext }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchProjectInfo = async () => {
      try {
        const investigationId = initialContext?.match(/investigation_id: ([^,\s]+)/)?.[1];
        
        if (!investigationId) {
          setMessages([{
            role: 'system',
            content: 'Viewing the entire project canvas. Please select an investigation type and focus to begin. You can set these from this chat by typing "type: [type]" or "focus: [focus]".'
          }]);
          return;
        }

        const { data: investigation, error } = await supabase
          .from('investigations')
          .select('title, investigation_type, investigation_focus')
          .eq('id', investigationId)
          .single();

        if (error) throw error;

        const message = investigation.investigation_type && investigation.investigation_focus
          ? `Project: ${investigation.title}\nType: ${investigation.investigation_type}\nFocus: ${investigation.investigation_focus}`
          : 'Viewing the entire project canvas. Please select an investigation type and focus to begin. You can set these from this chat by typing "type: [type]" or "focus: [focus]".';

        setMessages([{
          role: 'system',
          content: message
        }]);
      } catch (error) {
        console.error('Error fetching investigation details:', error);
        setMessages([{
          role: 'system',
          content: 'Error loading project details. Please try again later.'
        }]);
      }
    };

    fetchProjectInfo();
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
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() && !selectedFile) return;

    const userMessage = {
      role: 'user',
      content: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';

    const investigationId = initialContext?.match(/investigation_id: ([^,\s]+)/)?.[1];
    const { wasCommand, response } = await processMessage(input, investigationId);

    if (wasCommand && response) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response
      }]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-[72px] right-[8px] bottom-[8px] w-[360px] bg-background/30 backdrop-blur-md rounded-lg shadow-xl border border-gray-200 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b bg-white/50">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-purple-500" />
          <h2 className="font-semibold">Sift Assist</h2>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <ChatInput
        input={input}
        setInput={setInput}
        handleSubmit={handleSubmit}
        handleFileSelect={handleFileSelect}
        fileInputRef={fileInputRef}
        selectedFile={selectedFile}
      />
    </div>
  );
};

export default AIChatPanel;