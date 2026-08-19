import { FormBuilder, Validators } from '@angular/forms';
import { LeaseType, Property, VegetarianPreference, PropertyType, amenitiesList, FurnishedStatus } from '../../features/listings/models/property.model';
import { share } from 'rxjs';

export function buildPropertyFormData(fb: FormBuilder, initialData?: Property) {
  const formData = fb.group({
    title: [initialData?.title || '', [Validators.required, Validators.minLength(5)]],
    description: [
      initialData?.description || '',
      [Validators.required, Validators.minLength(20), Validators.maxLength(500)],
    ],

    city: [initialData?.location.city || '', [Validators.required]],
    locality: [initialData?.location.locality || '', [Validators.required]],
    address: [initialData?.location.address || '', [Validators.required]],

    areaSqft: [initialData?.areaSqft || null, [Validators.required, Validators.min(100)]],
    bedrooms: [initialData?.bedrooms || 1, [Validators.required, Validators.min(1), Validators.max(10)]],
    bathrooms: [initialData?.bathrooms || 1, [Validators.required, Validators.min(1), Validators.max(10)]],

    expectedRent: [initialData?.expectedRent || null, [Validators.required, Validators.min(1000)]],
    securityDeposit: [
      initialData?.securityDeposit || null,
      [Validators.required, Validators.min(0)],
    ],
    availableFrom: [initialData?.availableFrom || '', [Validators.required]],
    isRentNegotiable: [initialData?.isRentNegotiable || false],

    propertyType: [initialData?.propertyType || PropertyType.Apartment, [Validators.required]],
    leaseType: [initialData?.leaseType || LeaseType.LongTerm, [Validators.required]],
    isSharedProperty: [initialData?.isSharedProperty || false],


    furnishedStatus: [initialData?.furnishedStatus || FurnishedStatus.Unfurnished, [Validators.required]],
    vegetarianPreference: [initialData?.vegetarianPreference || VegetarianPreference.NoPreference, [Validators.required]],
    amenities: [initialData?.amenities || [], [Validators.required]],
    images: [initialData?.images|| [] , [Validators.required] ]
  });
  return formData;
}

export type PropertyFormGroup = ReturnType<typeof buildPropertyFormData>;

