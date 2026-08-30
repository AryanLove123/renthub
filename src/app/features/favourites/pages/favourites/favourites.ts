import { Component, computed, inject } from '@angular/core';
import { PropertyService } from '../../../listings/services/property.service';
import { AuthService } from '../../../../core/services/auth.service';
import { FavouriteService } from '../../services/favourite';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state';
import { PropertyCardComponent } from '../../../listings/components/property-card/property-card';

@Component({
  selector: 'app-favourites',
  imports: [EmptyStateComponent, PropertyCardComponent],
  templateUrl: './favourites.html',
  styleUrl: './favourites.scss',
})
export class Favourites {
  propertyService = inject(PropertyService);
  authService = inject(AuthService);
  favService = inject(FavouriteService);

  currentUser = this.authService.currentUser;
  favouriteProperties = computed(() => {
    const userId = this.currentUser()?.id;
    if (!userId) return [];
    const ids = this.favService.favouritedPropertyIds(userId)();
    return this.propertyService
      .properties()
      .filter((p) => ids.has(p.id));
  });

  onFavouriteToggled(propertyId: string): void {
    const userId = this.currentUser()?.id;
    if (!userId) return;
    this.favService.remove(userId, propertyId);
  }
}
