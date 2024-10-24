import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendIcon } from 'lucide-react';

const AIInput = ({ onAsk }) => {
  const [inputText, setInputText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputText.trim()) {
      onAsk(inputText);
      setInputText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <Input
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Ask AI to help you investigate..."
        className="flex-grow"
      />
      <Button type="submit" className="bg-[#594BFF] hover:bg-[#4B3FD9]">
        <SendIcon className="h-4 w-4 mr-2" />
        Ask
      </Button>
    </form>
  );
};

export default AIInput;