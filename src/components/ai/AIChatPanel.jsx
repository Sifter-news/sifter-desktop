import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, User, X, Paperclip } from 'lucide-react';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/supabase';

const AIChatPanel = ({ isOpen, onClose, initialContext }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchProjectInfo = async () => {
      try {
        // Extract investigation ID from initialContext if it exists
        const investigationId = initialContext?.match(/investigation_id: ([^,\s]+)/)?.[1];
        
        if (!investigationId) {
          setMessages([{
            role: 'system',
            content: 'Viewing the entire project canvas. Please select an investigation to begin.'
          }]);
          return;
        }

        const { data: investigation, error } = await supabase
          .from('investigations')
          .select('title, investigation_type, investigation_focus')
          .eq('id', investigationId)
          .single();

        if (error) throw error;

        const focusLabels = {
          'node_person': 'Person',
          'node_organization': 'Organization',
          'node_object': 'Object',
          'node_concept': 'Concept',
          'node_location': 'Location',
          'node_event': 'Event'
        };

        const typeLabels = {
          'generic': 'Generic Investigation',
          'research': 'Research',
          'pre-deal': 'Pre-Deal Due Diligence',
          'post-deal': 'Post-Deal Due Diligence',
          'aml': 'Anti-Money Laundering',
          'kyc': 'Know Your Customer',
          'regulatory': 'Regulatory Compliance',
          'fraud': 'Fraud Investigation',
          'background': 'Background Check',
          'asset': 'Asset Tracing'
        };

        const title = investigation.title;
        const type = investigation.investigation_type ? 
          typeLabels[investigation.investigation_type] : 
          'Type not set - please configure investigation type';
        const focus = investigation.investigation_focus ? 
          focusLabels[investigation.investigation_focus] : 
          'Focus not set - please configure investigation focus';

        setMessages([{
          role: 'system',
          content: `Project: ${title}\nType: ${type}\nFocus: ${focus}\n\n${initialContext || ''}`
        }]);

      } catch (error) {
        console.error('Error fetching investigation details:', error);
        setMessages([{
          role: 'system',
          content: 'Error loading project details. Viewing the entire canvas.'
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
    <div className="fixed top-[72px] right-[8px] bottom-8 w-[360px] bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
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
            <div
              key={index}
              className={`flex gap-2 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role === 'assistant' && (
                <MessageCircle className="h-6 w-6 text-purple-500" />
              )}
              <div
                className={`rounded-lg p-3 max-w-[80%] ${
                  message.role === 'user'
                    ? 'bg-purple-500 text-white'
                    : message.role === 'system'
                    ? 'bg-gray-100 text-gray-700'
                    : 'bg-gray-100'
                }`}
              >
                {message.content}
              </div>
              {message.role === 'user' && (
                <User className="h-6 w-6 text-purple-500" />
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
          <Button type="submit" className="bg-purple-500 hover:bg-purple-600 text-white">Send</Button>
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