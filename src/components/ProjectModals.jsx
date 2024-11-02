import React, { useState } from 'react';
import InvestigationModal from './modals/ModalEdit_Investigation';
import ContentModal from './ContentModal';

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
      <InvestigationModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        investigation={project}
        onUpdate={onProjectUpdate}
      />
      <ContentModal
        isOpen={isNewArticleModalOpen}
        onClose={() => setIsNewArticleModalOpen(false)}
        content={editingArticle || { title: '', content: '' }}
        onSave={handleSaveArticle}
        type="article"
      />
    </>
  );
};

export default ProjectModals;