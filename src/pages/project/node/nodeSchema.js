const baseSchema = {
  id: String,
  type: String,
  title: String,
  content: String,
  x: Number,
  y: Number,
};

export const nodeSchemas = {
  blank: {
    ...baseSchema,
  },
  event: {
    ...baseSchema,
    date: Date,
    location: String,
  },
  person: {
    ...baseSchema,
    birthDate: Date,
    occupation: String,
  },
  organization: {
    ...baseSchema,
    foundedDate: Date,
    industry: String,
  },
  object: {
    ...baseSchema,
    category: String,
  },
  location: {
    ...baseSchema,
    coordinates: {
      latitude: Number,
      longitude: Number,
    },
  },
  concept: {
    ...baseSchema,
    category: String,
  },
};

export const getNodeSchema = (type) => {
  return nodeSchemas[type] || nodeSchemas.blank;
};