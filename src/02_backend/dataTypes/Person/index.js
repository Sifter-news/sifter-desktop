/**
 * @file Person/index.js
 * @description Data type definition for nodes representing individuals
 */

export const PersonNodeType = {
  type: 'node_person',
  fields: {
    knownAs: {
      type: 'string',
      required: false,
      maxLength: 255
    },
    title: {
      type: 'string',
      required: false,
      maxLength: 50
    },
    firstName: {
      type: 'string',
      required: false,
      maxLength: 100
    },
    middleName: {
      type: 'string',
      required: false,
      maxLength: 100
    },
    lastName: {
      type: 'string',
      required: false,
      maxLength: 100
    },
    dateOfBirth: {
      type: 'date',
      required: false
    },
    dateOfDeath: {
      type: 'date',
      required: false
    },
    gender: {
      type: 'string',
      enum: ['Male', 'Female', 'Other'],
      required: false
    },
    background: {
      type: 'text',
      required: false
    },
    roles: {
      type: 'array',
      items: {
        type: 'string'
      }
    },
    metadata: {
      type: 'object',
      properties: {
        avatar: { type: 'string' },
        aliases: { type: 'array', items: { type: 'string' } },
        tags: { type: 'array', items: { type: 'string' } }
      }
    }
  }
};

export default PersonNodeType;