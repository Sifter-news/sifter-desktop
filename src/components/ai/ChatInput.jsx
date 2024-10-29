import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Paperclip } from 'lucide-react';

const ChatInput = ({ input, setInput, handleSubmit, handleFileSelect, fileInputRef, selectedFile }) => {
  return (
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
        <Button type="submit" className="bg-purple-500 hover:bg-purple-600 text-white">
          Send
        </Button>
      </div>
      {selectedFile && (
        <div className="mt-2 text-sm text-gray-500 flex items-center gap-2">
          <Paperclip className="h-3 w-3" />
          {selectedFile.name}
        </div>
      )}
    </form>
  );
};

export default ChatInput;