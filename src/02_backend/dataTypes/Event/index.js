/**
 * @file Event/index.js
 * @description Data type for nodes representing time-based events
 */

export const EventType = {
  type: 'event',
  fields: {
    title: { type: 'string', required: true },
    description: { type: 'string' },
    start_date: { type: 'timestamp', required: true },
    end_date: { type: 'timestamp' },
    location: { type: 'string' },
    participants: { type: 'array', items: { type: 'string' } },
    status: { type: 'string', enum: ['planned', 'ongoing', 'completed', 'cancelled'] }
  },
  defaultValues: {
    title: 'New Event',
    description: '',
    start_date: new Date().toISOString(),
    status: 'planned',
    participants: []
  }
};

export default EventType;