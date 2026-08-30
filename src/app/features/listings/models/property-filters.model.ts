import { Amenity, FurnishedStatus, PropertyType } from "./property.model";

export interface PropertyFilters {
  keyword?: string;
  city?: string;
  minRent?: number;
  maxRent?: number;
  propertyType?: PropertyType;
  bedrooms?: number;
  furnishedStatus?: FurnishedStatus;
  amenities?: Amenity[];
}

export type PropertySortOption = 'newest' | 'price_asc' | 'price_desc';
