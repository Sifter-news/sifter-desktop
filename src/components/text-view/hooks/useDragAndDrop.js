export const useDragAndDrop = (navigatorNodes, setNavigatorNodes) => {
  const findItemById = (items, id) => {
    if (!items) return null;
    
    for (let item of items) {
      if (!item) continue;
      if (item.id === id) return item;
      if (item.children && item.children.length > 0) {
        const found = findItemById(item.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const reorderItems = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const sourceItem = findItemById(navigatorNodes, result.draggableId);
    const destinationItem = findItemById(navigatorNodes, result.destination.droppableId);

    if (!sourceItem) return;

    if (destinationItem && destinationItem.type === 'folder') {
      const newItems = [...navigatorNodes];
      const sourceParent = findItemById(newItems, result.source.droppableId);
      
      if (sourceParent && sourceParent.children) {
        sourceParent.children = sourceParent.children.filter(child => child && child.id !== sourceItem.id);
      } else {
        const index = newItems.findIndex(item => item && item.id === sourceItem.id);
        if (index !== -1) newItems.splice(index, 1);
      }

      if (!destinationItem.children) {
        destinationItem.children = [];
      }
      destinationItem.children.splice(result.destination.index, 0, sourceItem);
      setNavigatorNodes(newItems);
    } else {
      setNavigatorNodes(reorderItems(navigatorNodes, result.source.index, result.destination.index));
    }
  };

  return { handleDragEnd };
};