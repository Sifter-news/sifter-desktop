import React from 'react';
import { Pencil, Trash2, MoreVertical, MessageCircle, FolderPlus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from '@/config/supabase';

const NodeListItemActions = ({ node, onEdit, onDelete, onAIConversation }) => {
  const handleCreateGroup = async (e) => {
    e.stopPropagation();
    try {
      // First create the folder/group
      const { data: folderData, error: folderError } = await supabase
        .from('node')
        .insert([{
          title: 'New Group',
          type: 'folder',
          investigation_id: node.investigation_id
        }])
        .select()
        .single();

      if (folderError) throw folderError;

      // Then update the node to be a child of the new folder
      const { error: updateError } = await supabase
        .from('node')
        .update({ parent_node_id: folderData.id })
        .eq('id', node.id);

      if (updateError) throw updateError;
      
      toast.success('Group created and node moved successfully');
      window.location.reload();
    } catch (error) {
      console.error('Error creating group:', error);
      toast.error('Failed to create group');
    }
  };

  return (
    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-6 w-6 p-0">
            <MoreVertical className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}>
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={handleCreateGroup}>
            <FolderPlus className="h-4 w-4 mr-2" />
            Create Group
          </DropdownMenuItem>

          {onAIConversation && (
            <DropdownMenuItem 
              onClick={(e) => {
                e.stopPropagation();
                onAIConversation(node);
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white focus:bg-purple-700 focus:text-white"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              AI Conversation
            </DropdownMenuItem>
          )}
          
          <DropdownMenuItem
            className="text-red-600"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(node.id);
            }}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default NodeListItemActions;