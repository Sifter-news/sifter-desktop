/**
 * @file Person.js
 * @description Data type definition for nodes representing individuals
 * 
 * Potential improvements:
 * - Add more biographical fields
 * - Add relationship mappings
 * - Add timeline integration
 * - Add document references
 * - Add social media links
 * - Add contact information
 * - Add role history
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