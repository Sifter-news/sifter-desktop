import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageCircle } from 'lucide-react';
import { toast } from "sonner";
import NodeTypeSelect from './NodeTypeSelect';
import NodeStyleSelect from './NodeStyleSelect';
import NodeMetadataFields from './NodeMetadataFields';
import NodeAvatar from './NodeAvatar';
import AIChatPanel from '../ai/AIChatPanel';

const NodeEditModal = ({ isOpen, onClose, node, onUpdate }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    nodeType: '',
    visualStyle: '',
    metadata: {},
    avatar: ''
  });
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);

  useEffect(() => {
    if (node) {
      setFormData({
        title: node.title || '',
        description: node.description || '',
        nodeType: node.nodeType || 'generic',
        visualStyle: node.visualStyle || 'default',
        metadata: node.metadata || {},
        avatar: node.avatar || '/default-image.png'
      });
    }
  }, [node]);

  const handleSubmit = async () => {
    try {
      await onUpdate(node.id, formData);
      toast.success("Node updated successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to update node");
    }
  };

  const handleOpenAIChat = () => {
    setIsAIChatOpen(true);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Node</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <NodeAvatar
              avatar={formData.avatar}
              onAvatarChange={(avatar) => setFormData(prev => ({ ...prev, avatar }))}
            />

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Node Type</Label>
                <NodeTypeSelect
                  value={formData.nodeType}
                  onChange={(nodeType) => setFormData(prev => ({ ...prev, nodeType }))}
                />
              </div>
              <div>
                <Label>Visual Style</Label>
                <NodeStyleSelect
                  value={formData.visualStyle}
                  onChange={(visualStyle) => setFormData(prev => ({ ...prev, visualStyle }))}
                />
              </div>
            </div>

            <NodeMetadataFields
              nodeType={formData.nodeType}
              metadata={formData.metadata}
              onMetadataChange={(field, value) => 
                setFormData(prev => ({
                  ...prev,
                  metadata: { ...prev.metadata, [field]: value }
                }))
              }
            />
          </div>

          <DialogFooter className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handleOpenAIChat}
              className="bg-purple-100 hover:bg-purple-200 text-purple-700"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Open Sift Assist
            </Button>
            <div className="space-x-2">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button onClick={handleSubmit}>Save changes</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AIChatPanel
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
        initialContext={`Editing node: ${node?.title || ''}\n${node?.description || ''}`}
      />
    </>
  );
};

export default NodeEditModal;