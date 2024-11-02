/**
 * @file Person/index.js
 * @description Data type definition for nodes representing individuals
 */

export const PersonNodeType = {
  type: 'node_person',
  fields: {
    fullName: {
      type: 'string',
      required: true,
      maxLength: 100
    },
    dateOfBirth: {
      type: 'date',
      required: false
    },
    nationality: {
      type: 'string',
      required: false
    },
    occupation: {
      type: 'string',
      required: false
    },
    organizations: {
      type: 'array',
      items: {
        type: 'reference',
        nodeType: 'node_organization'
      }
    },
    locations: {
      type: 'array',
      items: {
        type: 'reference',
        nodeType: 'node_location'
      }
    },
    events: {
      type: 'array',
      items: {
        type: 'reference',
        nodeType: 'node_event'
      }
    },
    metadata: {
      type: 'object',
      properties: {
        avatar: { type: 'string' },
        biography: { type: 'string' },
        aliases: { type: 'array', items: { type: 'string' } },
        tags: { type: 'array', items: { type: 'string' } }
      }
    }
  }
};

export default PersonNodeType;