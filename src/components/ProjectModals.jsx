import React, { useState } from 'react';
import ProjectEditModal from './ProjectEditModal';
import ArticleModal from './ArticleModal';

const ProjectModals = ({ project, onProjectUpdate }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNewArticleModalOpen, setIsNewArticleModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);

  const handleProjectClick = () => {
    setIsEditModalOpen(true);
  };

  const handleNewArticle = () => {
    setEditingArticle(null);
    setIsNewArticleModalOpen(true);
  };

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
    <>
      <ProjectEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        project={project}
        onUpdate={onProjectUpdate}
      />
      <ArticleModal
        isOpen={isNewArticleModalOpen}
        onClose={() => setIsNewArticleModalOpen(false)}
        article={editingArticle || { title: '', content: '' }}
        onUpdate={handleSaveArticle}
      />
    </>
  );
};

export default ProjectModals;