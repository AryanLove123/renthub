export enum PropertyType {
  Apartment = 'Apartment',
  IndependentHouse = 'IndependentHouse',
  Villa = 'Villa',
  PG = 'PG',
}

export interface PropertyLocation {
  city: string;
  locality: string;
  address: string;
}

export enum FurnishedStatus {
  FullyFurnished = 'Fully Furnished',
  SemiFurnished = 'Semi Furnished',
  Unfurnished = 'Unfurnished',
}

export enum LeaseType {
  ShortTerm = 'Short Term',
  LongTerm = 'Long Term',
  Both = 'Both'
}

export enum VegetarianPreference {
  Vegetarian = 'Vegetarian',
  NonVegetarian = 'Non-Vegetarian',
  Vegan = 'Vegan',
  NoPreference = 'No Preference',
}

export enum PropertyStatus {
  Available = 'Available',
  Rented = 'Rented',
  UnderMaintenance = 'Under Maintenance',
}

export const amenitiesList = [
  'Gym / Fitness Center',
  'Wi-Fi',
  'Air Conditioning',
  'Parking',
  'Swimming Pool',
  'Water Heater',
  'Laundry Facilities',
  'Garden',
  'Elevator',
  'Garbage Disposal',
  'Security System',
  'Clubhouse',
];

export type Amenity = (typeof amenitiesList)[number];

export interface Property {
  id: string;
  propertyType: PropertyType;
  landlordId: string;
  isSharedProperty: boolean;
  location: PropertyLocation;
  areaSqft: number;
  bedrooms: number;
  bathrooms: number;
  leaseType: LeaseType;
  vegetarianPreference: VegetarianPreference;
  propertyStatus: PropertyStatus;
  expectedRent: number;
  isRentNegotiable: boolean;
  securityDeposit?: number;
  furnishedStatus: FurnishedStatus;
  description: string;
  title: string;
  images: string[];
  amenities: Amenity[];
  createdAt: string;
  updatedAt: string;
  availableFrom: string;
}
