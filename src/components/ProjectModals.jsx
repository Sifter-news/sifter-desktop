import React, { useState } from 'react';
import ProjectEditModal from './ProjectEditModal';
import ContentModal from './ContentModal';

const ProjectModals = ({ project, onProjectUpdate }) => {
  const [isNewArticleModalOpen, setIsNewArticleModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);

  const handleSaveArticle = (article) => {
    if (editingArticle) {
      const updatedReports = project.reports.map(report =>
        report.id === editingArticle.id ? { ...article, id: report.id } : report
      );
      onProjectUpdate({ ...project, reports: updatedReports });
    } else {
      const updatedReports = [...project.reports, { ...article, id: Date.now() }];
      onProjectUpdate({ ...project, reports: updatedReports });
    }
    setIsNewArticleModalOpen(false);
    setEditingArticle(null);
  };

  return (
    <ContentModal
      isOpen={isNewArticleModalOpen}
      onClose={() => setIsNewArticleModalOpen(false)}
      content={editingArticle || { title: '', content: '' }}
      onSave={handleSaveArticle}
      type="article"
    />
  );
};

export default ProjectModals;