import { Component, computed, inject, signal } from '@angular/core';
import { PropertyService } from '../../services/property.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { PropertyDraft } from '../../../../shared/utils/property-form.utils';
import { ErrorStateComponent } from '../../../../shared/components/error-state/error-state.component';
import { PropertyFormComponent } from '../../components/property-form/property-form';
import { PropertyPreviewComponent } from '../../components/property-preview/property-preview';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

type Step = 'FORM' | 'PREVIEW';

@Component({
  selector: 'app-edit-listing',
  imports: [ErrorStateComponent, PropertyFormComponent, PropertyPreviewComponent],
  templateUrl: './edit-listing.html',
  styleUrl: './edit-listing.scss',
})
export class EditListingComponent {
  route = inject(ActivatedRoute);
  router = inject(Router);
  propertyService = inject(PropertyService);
  authService = inject(AuthService);

  propertyId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('id') ?? '')),
    { initialValue: '' }
  );

  property = computed(() => this.propertyService.getPropertyById(this.propertyId()));
  isOwner = this.authService.currentUser()?.id == this.property()?.landlordId;

  step = signal<Step>('FORM');
  draft = signal<PropertyDraft | null>(null);
  isSubmitting = signal(false);

  onPreviewRequested(draft: PropertyDraft): void{
    this.draft.set(draft);
    this.step.set('PREVIEW');
  }

  onEditRequested(): void {
    this.step.set('FORM');
  }

  onConfirmed(): void{
    const draft = this.draft();
    const landlordId = this.authService.currentUser()?.id;

    if (!draft || !landlordId) return;

    this.isSubmitting.set(true);
    this.propertyService.update(this.propertyId(), landlordId, draft).subscribe({
      next: (updated) =>{
        this.isSubmitting.set(false);
        this.router.navigate(['/listings', updated.id]);
      },
      error: (err: Error) =>{
        this.isSubmitting.set(false);
      },
    });
  }
}
