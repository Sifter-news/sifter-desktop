import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import BaseModal from '@/01_components/01_global/modals/BaseModal';

const ContentModal = ({ isOpen, onClose, content, onSave, type = 'article' }) => {
  const [title, setTitle] = useState('');
  const [contentText, setContentText] = useState('');

  useEffect(() => {
    if (content) {
      setTitle(content.title || '');
      setContentText(content.content || '');
    } else {
      setTitle('');
      setContentText('');
    }
  }, [content]);

  const handleSave = () => {
    if (!title.trim()) return;
    
    const updatedContent = {
      ...(content || {}),
      title: title.trim(),
      content: contentText.trim(),
      id: content?.id || Date.now(),
      image: content?.image || '/default-image.png'
    };
    
    onSave(updatedContent);
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={content ? `Edit ${type}` : `Create New ${type}`}
      onSave={handleSave}
    >
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={`${type} Title`}
            className="col-span-4"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Textarea
            id="content"
            value={contentText}
            onChange={(e) => setContentText(e.target.value)}
            placeholder={`${type} Content`}
            className="col-span-4"
            rows={5}
          />
        </div>
      </div>
    </BaseModal>
  );
};

export default ContentModal;
