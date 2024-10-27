import React from 'react';
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';

const SearchInput = ({ value, onChange }) => {
  return (
    <div className="relative">
      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
      <Input
        type="text"
        placeholder="Search nodes..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-8"
      />
    </div>
  );
};

export default SearchInput;