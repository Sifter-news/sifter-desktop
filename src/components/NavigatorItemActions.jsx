import React from 'react';
import { MoreVertical, Trash, FolderInput, Pencil, Copy, FolderPlus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/supabase';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NavigatorItemActions = ({ item, onEditProject }) => {
  const handleDelete = async (e) => {
    e.stopPropagation();
    try {
      const { error } = await supabase
        .from('nodes')
        .delete()
        .eq('id', item.id);

      if (error) throw error;
      
      toast.success('Node deleted successfully');
      window.location.reload();
    } catch (error) {
      console.error('Error deleting node:', error);
      toast.error('Failed to delete node');
    }
  };

  const handleCreateGroup = async (e) => {
    e.stopPropagation();
    try {
      const { data, error } = await supabase
        .from('nodes')
        .insert([{
          title: 'New Group',
          type: 'folder',
          parent_node_id: item.type === 'folder' ? item.id : null,
          investigation_id: item.investigation_id
        }])
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Group created successfully');
      window.location.reload();
    } catch (error) {
      console.error('Error creating group:', error);
      toast.error('Failed to create group');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-300" onClick={(e) => e.stopPropagation()}>
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={(e) => {
          e.stopPropagation();
          onEditProject(item);
        }}>
          <Pencil className="mr-2 h-4 w-4" />
          <span>Edit</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleCreateGroup}>
          <FolderPlus className="mr-2 h-4 w-4" />
          <span>Create Group</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => console.log('Move')}>
          <FolderInput className="mr-2 h-4 w-4" />
          <span>Move to</span>
        </DropdownMenuItem>

        <DropdownMenuItem 
          onClick={handleDelete}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash className="mr-2 h-4 w-4" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NavigatorItemActions;