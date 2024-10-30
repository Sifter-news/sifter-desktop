import React, { useState } from 'react';
import { AlertCircle, Plus, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

const DebugErrorSection = ({ errors = [] }) => {
  const [queries, setQueries] = useState([]);
  const [newQuery, setNewQuery] = useState('');

  const addQuery = () => {
    if (newQuery.trim()) {
      setQueries([...queries, newQuery.trim()]);
      setNewQuery('');
    }
  };

  const removeQuery = (index) => {
    setQueries(queries.filter((_, i) => i !== index));
  };

  const filterErrors = (error) => {
    if (queries.length === 0) return true;
    return queries.some(query => 
      error.message?.toLowerCase().includes(query.toLowerCase()) ||
      error.type?.toLowerCase().includes(query.toLowerCase())
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <AlertCircle className="h-4 w-4 text-red-400" />
        <h3 className="text-sm font-medium text-white">Error Log</h3>
      </div>
      
      <ScrollArea className="h-[200px]">
        <div className="space-y-2">
          {errors.filter(filterErrors).map((error, index) => (
            <div key={index} className="bg-black/50 p-2 rounded text-xs space-y-1">
              <p className="text-red-400 font-medium">{error.message}</p>
              {error.type && <p className="text-white/60">Type: {error.type}</p>}
              {error.timestamp && (
                <p className="text-white/60">
                  Time: {new Date(error.timestamp).toLocaleTimeString()}
                </p>
              )}
              {error.stack && (
                <pre className="text-white/40 text-[10px] mt-1 p-1 bg-black/30 rounded overflow-x-auto">
                  {error.stack}
                </pre>
              )}
            </div>
          ))}
          {errors.filter(filterErrors).length === 0 && (
            <p className="text-white/40 text-center py-4">No errors logged</p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default DebugErrorSection;