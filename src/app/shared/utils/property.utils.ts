import { PropertyFilters, PropertySortOption } from "../../features/listings/models/property-filters.model";
import { Amenity, Property } from "../../features/listings/models/property.model";

export function filterProperties(properties: Property[], filters: PropertyFilters): Property[] {
  return properties.filter((property) => {
    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase();
      const haystack = `${property.title} ${property.description} ${property.location.city} ${property.location.locality}`.toLowerCase();
      if (!haystack.includes(keyword)) {
        return false;
      }
    }

    if (filters.city && property.location.city.toLowerCase() !== filters.city.toLowerCase()) {
      return false;
    }

    if (filters.minRent !== undefined && property.expectedRent < filters.minRent) {
      return false;
    }

    if (filters.maxRent !== undefined && property.expectedRent > filters.maxRent) {
      return false;
    }

    if (filters.propertyType && property.propertyType !== filters.propertyType) {
      return false;
    }

    if (filters.bedrooms !== undefined && property.bedrooms !== filters.bedrooms) {
      return false;
    }

    if (filters.furnishedStatus && property.furnishedStatus !== filters.furnishedStatus) {
      return false;
    }

    if (filters.amenities && filters.amenities.length > 0) {
      const hasAllAmenities = filters.amenities.every((amenity: Amenity) => property.amenities.includes(amenity));
      if (!hasAllAmenities) {
        return false;
      }
    }

    return true;
  });
}


export function sortProperties(properties: Property[], sortOption: PropertySortOption): Property[] {
  const copy = [...properties];

  switch (sortOption) {
    case 'price_asc':
      return copy.sort((a, b) => a.expectedRent - b.expectedRent);
    case 'price_desc':
      return copy.sort((a, b) => b.expectedRent - a.expectedRent);
    case 'newest':
    default:
      return copy.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}

export function paginatedProperties(properties: Property[], page: number, pageSize: number): Property[] {
  const start = (page - 1) * pageSize;
  return properties.slice(start, start + pageSize);
}