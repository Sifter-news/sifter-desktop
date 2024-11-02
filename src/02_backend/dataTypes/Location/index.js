/**
 * @file Location/index.js
 * @description Data type for nodes representing geographical locations
 */

export const LocationType = {
  type: 'location',
  fields: {
    name: { type: 'string', required: true },
    description: { type: 'string' },
    address: { type: 'string' },
    latitude: { type: 'number' },
    longitude: { type: 'number' },
    type: { type: 'string', enum: ['address', 'city', 'country', 'landmark'] }
  },
  defaultValues: {
    name: 'New Location',
    description: '',
    type: 'address',
    latitude: 0,
    longitude: 0
  }
};

export default LocationType;