/**
 * @file Generic/index.js
 * @description Default data type with general properties for nodes
 */

export const GenericNodeType = {
  type: 'generic',
  fields: {
    title: { type: 'string', required: true },
    description: { type: 'string' },
    tags: { type: 'array', items: { type: 'string' } },
    created_at: { type: 'timestamp' },
    updated_at: { type: 'timestamp' }
  },
  defaultValues: {
    title: 'New Node',
    description: '',
    tags: []
  }
};

export default GenericNodeType;