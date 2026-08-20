import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  buildPropertyFormData,
  PropertyDraft,
  PropertyFormGroup,
} from '../../../../shared/utils/property-form.utils';
import { nowIso } from '../../../../shared/utils/id.utils';
import {
  Property,
  PropertyType,
  LeaseType,
  FurnishedStatus,
  amenitiesList,
  VegetarianPreference,
  PropertyStatus,
  Amenity,
} from '../../models/property.model';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { PropertyService } from '../../services/property.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-property-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatRadioModule,
    MatIconModule,
  ],
  templateUrl: './property-form.html',
  styleUrl: './property-form.scss',
})
export class PropertyFormComponent {
  @Input() initialData?: Property;
  @Output() previewRequested = new EventEmitter<PropertyDraft>();

  imageUrlInput = '';

  propertyTypes = Object.values(PropertyType);
  leaseTypes = Object.values(LeaseType);
  furnishedStatus = Object.values(FurnishedStatus);
  vegetarianPreferences = Object.values(VegetarianPreference);
  amenityOptions = amenitiesList;

  fb = inject(FormBuilder);
  propertyService = inject(PropertyService);
  authService = inject(AuthService);

  propertyForm: PropertyFormGroup = buildPropertyFormData(this.fb, this.initialData);

  isAmenityChecked(amenity: Amenity): boolean {
    return (this.propertyForm.controls.amenities.value ?? []).includes(amenity);
  }

  toggleAmenity(amenity: Amenity, checked: boolean): void {
    const current = this.propertyForm.controls.amenities.value ?? [];
    const next = checked ? [...current, amenity] : current.filter((item) => item != amenity);

    this.propertyForm.controls.amenities.setValue(next);
  }

  onImageUrlInputChange(e: Event) {
    const rawInput = (e.target as HTMLTextAreaElement).value;
    const imageUrlsArray = rawInput
      .split(',')
      .map((url) => url.trim())
      .filter((url) => url.length > 0);
    this.propertyForm.controls.images.setValue(imageUrlsArray);
    this.propertyForm.controls.images.markAsTouched();
  }

  onSubmit(): void {
    // console.log(this.propertyForm.value);
    // // const landLordId = this.authService.currentUser()?.id;
    // const landlordId = 'LandlordId123';
    // const status = PropertyStatus.Available;
    // const createdAt = nowIso();
    // const updatedAt = nowIso();

    // const newProperty: any = {
    //   ...this.propertyForm.value,
    //   id: landlordId,
    //   propertyStatus: status,
    //   createdAt: createdAt,
    //   updatedAt: updatedAt,
    // };
    // const updated = [...this.propertyService.loadProperties(), newProperty];
    // this.propertyService.persistProperties(updated);
    const draftData = this.propertyForm.getRawValue() as PropertyDraft;
    console.log("this is my draftdata",draftData);
    this.previewRequested.emit(draftData);
  }
}
