import { Component, computed, inject } from '@angular/core';
import { MatAnchor } from "@angular/material/button";
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from "@angular/router";
import { AuthService } from '../../../../core/services/auth.service';
import { PropertyService } from '../../services/property.service';
import { PropertyCardComponent } from '../../components/property-card/property-card';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state';
import { ConfirmationDialogComponent, ConfirmationDialogData } from '../../../../shared/components/confirmation-dialog/confirmation-dialog';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-my-listings',
  imports: [MatAnchor, RouterLink, MatIconModule, PropertyCardComponent, EmptyStateComponent],
  templateUrl: './my-listings.html',
  styleUrl: './my-listings.scss',
})
export class MyListingsComponent {
  authService = inject(AuthService);
  propertyService = inject(PropertyService);
  router = inject(Router);
  dialog = inject(MatDialog);

  currentUser = this.authService.currentUser;

  myListings = computed(() =>{
    const userId = this.currentUser()?.id;

    if(!userId) return [];
    const allProperties = this.propertyService.properties();
    const list = allProperties.filter(p => p.landlordId === userId);
    console.log("Calculated listings:", list);
    console.log("this is my list", list);
    return list;
  })

  onEdit(propertyId: string): void {
    this.router.navigate(['/landlord/listings', propertyId, 'edit']);
  }

  onDelete(propertyId: string): void {
    const userId = this.currentUser()?.id;
    if (!userId) return;
    const property = this.propertyService.getPropertyById(propertyId);
    if (!property) return;

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
        this.propertyService.delete(propertyId, userId).subscribe({
          next: () => console.log("listing deleted"),
          error: (err: Error) => console.log(err.message),
        });
      });
  }
}
