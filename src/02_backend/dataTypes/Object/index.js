/**
 * @file Object/index.js
 * @description Data type for nodes representing generic objects
 */

export const ObjectType = {
  type: 'object',
  fields: {
    name: { type: 'string', required: true },
    description: { type: 'string' },
    category: { type: 'string' },
    status: { type: 'string', enum: ['active', 'inactive', 'archived'] },
    metadata: { type: 'object' }
  },
  defaultValues: {
    name: 'New Object',
    description: '',
    category: '',
    status: 'active',
    metadata: {}
  }
};

export default ObjectType;