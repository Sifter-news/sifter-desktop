export interface BaseNode {
  id: string;
  type: 'basic' | 'person' | 'organization' | 'object' | 'event' | 'concept' | 'location';
  title: string;
  abstract: string;
  description: string;
  x: number;
  y: number;
}

export interface PersonNode extends BaseNode {
  type: 'person';
  gender?: 'Male' | 'Female' | 'Other';
  dateOfBirth?: string;
  dateOfDeath?: string;
  employment?: string;
  education?: string;
  ownership?: string;
  publicPerception?: string;
  keyLinks?: string[];
}

export interface OrganizationNode extends BaseNode {
  type: 'organization';
  headquarters?: string;
  parentOrganization?: string;
  keyLinks?: string[];
}

export interface ObjectNode extends BaseNode {
  type: 'object';
  objectType?: 'Document' | 'Report' | 'Paper' | 'Land' | 'Vehicle' | 'Asset' | 'Other';
  currentOwner?: string;
  creator?: string;
  creationDate?: string;
  relatedConcept?: string;
  location?: string;
}

export interface EventNode extends BaseNode {
  type: 'event';
  eventType?: 'Birth' | 'Death' | 'Health' | 'Education' | 'Employment' | 'Ownership' | 'Legal' | 'Other';
  startDate?: string;
  endDate?: string;
  location?: string;
  relatedPerson?: string;
  relatedOrganization?: string;
}

export interface ConceptNode extends BaseNode {
  type: 'concept';
  firstUse?: string;
  evolution?: string;
  sourceDocument?: string;
}

export interface LocationNode extends BaseNode {
  type: 'location';
  latitude?: number;
  longitude?: number;
  keyLinks?: string[];
}

export type Node = BaseNode | PersonNode | OrganizationNode | ObjectNode | EventNode | ConceptNode | LocationNode;