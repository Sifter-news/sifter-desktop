export const saveInvestigationState = (investigationId, nodes) => {
  localStorage.setItem(`investigation_${investigationId}`, JSON.stringify(nodes));
};

export const loadInvestigationState = (investigationId) => {
  const savedState = localStorage.getItem(`investigation_${investigationId}`);
  return savedState ? JSON.parse(savedState) : [];
};