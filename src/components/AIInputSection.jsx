import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon } from 'lucide-react';

const AIInputSection = ({ aiInputText, setAIInputText, handleAIAsk, aiInputRef }) => {
  return (
    <div className="bg-white rounded-full shadow-lg p-2 flex items-center space-x-2 max-w-xl w-full ring-2 ring-blue-500">
      <Button 
        size="icon" 
        className="rounded-full flex-shrink-0 bg-[#594BFF1A] hover:bg-[#594BFF33]"
        onClick={() => setAIInputText('')}
      >
        <PlusIcon className="h-6 w-6 text-[#594BFF]" />
      </Button>
      <Input 
        ref={aiInputRef}
        type="text" 
        placeholder="Ask anything about this project" 
        className="flex-grow text-lg border-none focus:ring-0 rounded-full"
        value={aiInputText}
        onChange={(e) => setAIInputText(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleAIAsk()}
      />
      <Button 
        className="bg-[#594BFF] hover:bg-[#4B3FD9] text-white rounded-full px-6"
        onClick={handleAIAsk}
      >
        Ask
      </Button>
    </div>
  );
};

export default AIInputSection;