export const handleSaveArticle = (article, project, updateProject) => {
  if (article.id) {
    const updatedReports = project.reports.map(report =>
      report.id === article.id ? article : report
    );
    updateProject({ ...project, reports: updatedReports });
  } else {
    const newArticle = { ...article, id: Date.now() };
    const updatedReports = [...project.reports, newArticle];
    updateProject({ ...project, reports: updatedReports });
  }
};

export const handleDeleteArticle = (articleId, project, updateProject) => {
  const updatedReports = project.reports.filter(report => report.id !== articleId);
  updateProject({ ...project, reports: updatedReports });
};