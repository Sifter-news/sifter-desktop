/**
 * @file Organisation/index.js
 * @description Data type for nodes representing organizations
 */

export const OrganisationType = {
  type: 'organisation',
  fields: {
    name: { type: 'string', required: true },
    description: { type: 'string' },
    industry: { type: 'string' },
    website: { type: 'string' },
    founded_date: { type: 'date' },
    headquarters: { type: 'string' },
    size: { type: 'string', enum: ['small', 'medium', 'large', 'enterprise'] }
  },
  defaultValues: {
    name: 'New Organization',
    description: '',
    industry: '',
    size: 'small'
  }
};

export default OrganisationType;