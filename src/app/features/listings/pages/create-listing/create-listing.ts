import { Component, inject, signal } from '@angular/core';
import { PropertyFormComponent } from '../../components/property-form/property-form';
import { PropertyDraft } from '../../../../shared/utils/property-form.utils';
import { PropertyPreviewComponent } from '../../components/property-preview/property-preview';
import { AuthService } from '../../../../core/services/auth.service';
import { PropertyService } from '../../services/property.service';
import { Router } from '@angular/router';

type Step = 'FORM' | 'PREVIEW' ;
@Component({
  selector: 'app-create-listing',
  imports: [PropertyFormComponent, PropertyPreviewComponent],
  templateUrl: './create-listing.html',
  styleUrl: './create-listing.scss',
})
export class CreateListingComponent {
  step = signal<Step>('FORM');
  draft = signal<PropertyDraft | null>(null);
  isSubmitting = signal(false);

  authService = inject(AuthService);
  propertyService = inject(PropertyService);
  router = inject(Router);

  onPreviewRequested(draft: PropertyDraft): void{
    this.draft.set(draft);
    this.step.set('PREVIEW');
  }
  
  onEditRequested(){
    this.step.set('FORM');
  }

  onConfirm(){
    const draftData = this.draft();

    const landlordId = this.authService.currentUser()?.id || "Landlord123";

    if(!draftData || !landlordId) return;

    this.isSubmitting.set(true);

    this.propertyService.create(draftData,landlordId).subscribe({
      next: (property) =>{
        this.isSubmitting.set(false);
        this.router.navigate(['/landlord/listings']);
      },
      error: (err:Error) =>{
        this.isSubmitting.set(false);
      }
    })
  }
}
