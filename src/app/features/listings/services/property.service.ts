import { computed, inject, Injectable, signal } from '@angular/core';
import { StorageService } from '../../../core/services/storage.service';
import { Property, PropertyStatus } from '../models/property.model';
import { PropertyDraft } from '../../../shared/utils/property-form.utils';
import { generateId, nowIso } from '../../../shared/utils/id.utils';
import { delay, Observable, of, throwError } from 'rxjs';
import { PropertyFilters, PropertySortOption } from '../models/property-filters.model';
import {
  filterProperties,
  paginatedProperties,
  sortProperties,
} from '../../../shared/utils/property.utils';
import { SEED_PROPERTIES } from '../../../data/seed-data';

const PROPERTIES_KEY = 'renthub_properties';
const DEFAULT_PAGE_SIZE = 6;
@Injectable({ providedIn: 'root' })
export class PropertyService {
  storageService = inject(StorageService);

  properties = signal<Property[]>(this.loadProperties());
  filters = signal<PropertyFilters>({});
  sortOption = signal<PropertySortOption>('newest');
  currentPage = signal<number>(1);
  pageSize = DEFAULT_PAGE_SIZE;

  filteredAndSortedProperties = computed(() => {
    const filtered = filterProperties(this.properties(), this.filters());
    return sortProperties(filtered, this.sortOption());
  });

  pagedProperties = computed(() => {
    return paginatedProperties(this.filteredAndSortedProperties(), this.currentPage(), this.pageSize);
  });

  constructor(){
    this.storageService.seedIfEmpty(PROPERTIES_KEY, SEED_PROPERTIES);
    this.properties.set(this.loadProperties());
  }

  loadProperties(): Property[] {
    return this.storageService.getItem<Property[]>(PROPERTIES_KEY) ?? [];
  }

  persistProperties(properties: Property[]): void {
    this.storageService.setItem(PROPERTIES_KEY, properties);
    this.properties.set(properties);
  }

  create(draft: PropertyDraft, landlordId: string): Observable<Property> {
    const newProperty: Property = {
      ...draft,
      id: generateId('Property'),
      landlordId,
      propertyStatus: PropertyStatus.Available,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };

    const updated = [...this.properties(), newProperty];
    this.persistProperties(updated);
    return of(newProperty);
  }

  update(id: string, landlordId: string, draft: PropertyDraft): Observable<Property>{
    const existing  = this.getPropertyById(id);
    if(!existing){
      return throwError(() => new Error('Property not found'));
    }

    if(existing.landlordId != landlordId){
      return throwError(() => new Error('You are not authorized to edit this property'));
    }

    const updatedProperty: Property = {...existing, ...draft, updatedAt:nowIso()};
    const updated = this.properties().map( (p) => (p.id == id ? updatedProperty : p));
    this.persistProperties(updated);
    return of(updatedProperty);
  }

  delete(id: string, landlordId: string): Observable<void> {
    const existing = this.getPropertyById(id);
    if (!existing) {
      return throwError(() => new Error('Property not found.'));
    }
    if (existing.landlordId !== landlordId) {
      return throwError(() => new Error('You are not authorized to delete this property.'));
    }

    const updated = this.properties().filter((p) => p.id !== id);
    this.persistProperties(updated);
    return of(undefined).pipe(delay(300));
  }

  getPropertyById(id: string): Property | undefined {
    return this.properties().find((p) => p.id === id);
  }

  getPropertyByLandlordId(landlordId: string) {
    return this.properties()
      .filter((property) => property.landlordId === landlordId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  setFilters(combinedFilters: PropertyFilters): void {
    this.filters.set(combinedFilters);
  }

  setSortOption(sortOption: PropertySortOption): void {
    this.sortOption.set(sortOption);
    this.currentPage.set(1);
  }

  setPage(page: number): void {
    this.currentPage.set(page);
  }
}
