export type { WizardStep } from '../../models/models.js';

export type RealmId      = 'floating' | 'forest' | 'underground' | 'coastal' | 'cosmic';
export type FormId       = 'tower'    | 'warren' | 'pavilion'   | 'vessel'  | 'burrow';
export type ImpossibleId = 'infinite-room' | 'time-garden' | 'portal-door' | 'echo-library' | 'living-walls';
export type AtmosphereId = 'cozy' | 'awe' | 'wild' | 'serene' | 'mysterious';

export interface DreamSpace {
  realm:      RealmId      | null;
  form:       FormId       | null;
  impossible: ImpossibleId | null;
  atmosphere: AtmosphereId | null;
}

export interface RealmOption {
  id:             RealmId;
  name:           string;
  tagline:        string;
  description:    string;
  icon:           string;
  accentColor:    string;
  district:       string;
  naturalFeatures: readonly string[];
}

export interface FormOption {
  id:            FormId;
  name:          string;
  tagline:       string;
  description:   string;
  icon:          string;
  streetNumber:  string;
  streetName:    string;
  baseAmenities: readonly string[];
}

export interface ImpossibleOption {
  id:          ImpossibleId;
  name:        string;
  tagline:     string;
  description: string;
  icon:        string;
  accentColor: string;
}

export interface AtmosphereOption {
  id:          AtmosphereId;
  name:        string;
  tagline:     string;
  description: string;
  icon:        string;
  accentColor: string;
  adjective:   string;
}

export interface ImpossibleListing {
  title:       string;
  address:     string;
  description: string;
  amenities:   readonly string[];
  price:       string;
  listed:      string;
}
