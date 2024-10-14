import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ArticleModal = ({ isOpen, onClose, article, onUpdate }) => {
  const [title, setTitle] = useState(article.title);
  const [content, setContent] = useState(article.content);

  useEffect(() => {
    setTitle(article.title);
    setContent(article.content);
  }, [article]);

  const handleSave = () => {
    onUpdate({ ...article, title, content, image: '/placeholder.svg' });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[50vw] h-[50vh] fixed left-[calc(50%-25vw)] top-[calc(50%-25vh)] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{article.id ? 'Edit Article' : 'New Article'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Article Title"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Article Content"
            className="w-full h-[calc(100%-120px)] p-2 border rounded"
          />
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ArticleModal;