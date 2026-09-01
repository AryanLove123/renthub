import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PropertyService } from '../../services/property.service';
import { AuthService } from '../../../../core/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { UserRole } from '../../../../core/models/user.model';
import { PropertyStatus } from '../../models/property.model';
import { FavouriteService } from '../../../favourites/services/favourite';
import { ConfirmationDialogComponent, ConfirmationDialogData } from '../../../../shared/components/confirmation-dialog/confirmation-dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from "@angular/material/button";
import { EnumLabelPipe } from '../../../../shared/pipes/enum-label.pipe';
import { InrCurrencyPipe } from '../../../../shared/pipes/inr-currency.pipe';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-listing-detail',
  imports: [RouterLink, MatIconModule, MatButtonModule,EnumLabelPipe, InrCurrencyPipe, MatChipsModule],
  templateUrl: './listing-detail.html',
  styleUrl: './listing-detail.scss',
})
export class ListingDetailComponent {
  router = inject(Router);
  route = inject(ActivatedRoute);
  propertyService = inject(PropertyService);
  authService = inject(AuthService);
  favService = inject(FavouriteService)
  dialog = inject(MatDialog);

  userRole = UserRole;
  PropertyStatus = PropertyStatus;

  propertyId = signal(this.route.snapshot.paramMap.get('id') ?? '');
  property = computed(() => this.propertyService.getPropertyById(this.propertyId()));

  currentUser = this.authService.currentUser;

  isOwner = computed(() =>{
    const user = this.currentUser();
    const property = this.property();

    return !!user && !!property && user.role === UserRole.LANDLORD && user.id === property.landlordId;
  })

  isFavourite = computed(() => {
    const user = this.currentUser();
    const property = this.property();
    return !!user && !!property && this.favService.isFavourite(user.id, property.id);
  });

  landlordName(landlordId: string): string {
    return this.authService.getDisplayName(landlordId);
  }

  toggleFavourite(): void {
    const user = this.currentUser();
    const property = this.property();
    if (!user) {
      return;
    }
    if (!property) return;

    const wasFavourite = this.favService.isFavourite(user.id, property.id);
    this.favService.toggle(user.id, property.id);
  }

  editListing(): void {
    const property = this.property();
    if (!property) return;
    this.router.navigate(['/landlord/listings', property.id, 'edit']);
  }

  deleteListing(): void {
    const property = this.property();
    const user = this.currentUser();
    if (!property || !user) return;

    const data: ConfirmationDialogData = {
      title: 'Delete this listing?',
      message: `"${property.title}" will be permanently removed. This cannot be undone.`,
      confirmLabel: 'Delete',
      isDestructive: true,
    };

    this.dialog
      .open(ConfirmationDialogComponent, { data, width: '420px' })
      .afterClosed()
      .subscribe((confirmed) => {
        if (!confirmed) return;
        this.propertyService.delete(property.id, user.id).subscribe({
          next: () => {
            this.router.navigateByUrl('/landlord/listings');
          },
          error: (err: Error) => console.log(err.message),
        });
      });
  }
}
