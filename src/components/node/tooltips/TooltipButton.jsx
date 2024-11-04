import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronDown } from 'lucide-react';

const TooltipButton = ({ icon: Icon, onClick, isActive, className }) => {
  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className={`h-8 w-8 text-white hover:bg-white/10 ${className}`}
      onClick={onClick}
    >
      <Icon className="h-6 w-6" />
      <ChevronDown className="h-2.5 w-2.5 ml-1" />
    </Button>
  );
};

export default TooltipButton;