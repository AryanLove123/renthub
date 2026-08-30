import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { PropertyFilters } from '../../models/property-filters.model';
import { amenitiesList, Amenity, FurnishedStatus, PropertyType } from '../../models/property.model';
import { MatSelectModule } from '@angular/material/select';
import { EnumLabelPipe } from '../../../../shared/pipes/enum-label.pipe';
import { debounceTime } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-property-filters',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatButtonToggleModule,
    MatSelectModule,
    MatInput,
    EnumLabelPipe,
  ],
  templateUrl: './property-filters.html',
  styleUrl: './property-filters.scss',
})
export class PropertyFiltersComponent {
  @Output() onFiltersChanged = new EventEmitter<PropertyFilters>();
  @Output() closed = new EventEmitter<void>();

  amenityOptions = amenitiesList;
  bedroomOptions = [1, 2, 3, 4, 5];
  propertyTypeOptions = Object.values(PropertyType);
  furnishedStatusOptions = Object.values(FurnishedStatus);

  fb = inject(FormBuilder);

  propertyFilterForm = this.fb.group({
    minRent: this.fb.control<number | null>(null),
    maxRent: this.fb.control<number | null>(null),
    propertyType: this.fb.control<PropertyType | null>(null),
    bedrooms: this.fb.control<number | null>(null),
    furnishingStatus: this.fb.control<FurnishedStatus | null>(null),
    amenities: this.fb.control<Amenity[]>([]),
  });

  constructor() {
    this.propertyFilterForm.valueChanges
      .pipe(debounceTime(250), takeUntilDestroyed())
      .subscribe(() => this.emitFilters());
  }

  toggleAmenity(amenity: Amenity, checked: boolean): void {
    const current = this.propertyFilterForm.controls.amenities.value ?? [];
    const next = checked ? [...current, amenity] : current.filter((a) => a !== amenity);
    this.propertyFilterForm.controls.amenities.setValue(next);
  }

  isAmenityChecked(amenity: Amenity): boolean {
    return (this.propertyFilterForm.controls.amenities.value ?? []).includes(amenity);
  }

  clearFilters(): void {
    this.propertyFilterForm.reset({
      minRent: null,
      maxRent: null,
      propertyType: null,
      bedrooms: null,
      furnishingStatus: null,
      amenities: [],
    });
  }

  emitFilters(): void {
    const value = this.propertyFilterForm.getRawValue();
    const filters: PropertyFilters = {
      minRent: value.minRent ?? undefined,
      maxRent: value.maxRent ?? undefined,
      propertyType: value.propertyType ?? undefined,
      bedrooms: value.bedrooms ?? undefined,
      furnishedStatus: value.furnishingStatus ?? undefined,
      amenities: value.amenities && value.amenities.length > 0 ? value.amenities : undefined,
    };
    this.onFiltersChanged.emit(filters);
  }
}
