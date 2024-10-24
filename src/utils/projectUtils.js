export const saveProjectState = (projectId, nodes) => {
  localStorage.setItem(`project_${projectId}`, JSON.stringify(nodes));
};

export const loadProjectState = (projectId) => {
  const savedState = localStorage.getItem(`project_${projectId}`);
  return savedState ? JSON.parse(savedState) : [];
};