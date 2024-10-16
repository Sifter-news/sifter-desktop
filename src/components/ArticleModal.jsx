import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const ArticleModal = ({ isOpen, onClose, article, onSave, onDelete }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (article) {
      setTitle(article.title || '');
      setContent(article.content || '');
    } else {
      setTitle('');
      setContent('');
    }
  }, [article]);

  const handleSave = () => {
    onSave({ id: article?.id, title, content });
    onClose();
  };

  const handleDelete = () => {
    onDelete(article.id);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{article ? 'Edit Article' : 'Create New Article'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Article Title"
              className="col-span-4"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Article Content"
              className="col-span-4"
              rows={5}
            />
          </div>
        </div>
        <DialogFooter>
          {article && (
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          )}
          <Button type="submit" onClick={handleSave}>
            Save Article
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ArticleModal;