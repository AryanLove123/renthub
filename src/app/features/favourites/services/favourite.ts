import { computed, inject, Injectable, signal } from '@angular/core';
import { Favourite } from '../models/favourite.model';
import { StorageService } from '../../../core/services/storage.service';
import { nowIso } from '../../../shared/utils/id.utils';

const FAVOURITES_KEY = 'renthub_favourites';
@Injectable({
  providedIn: 'root',
})
export class FavouriteService {
  private readonly storage = inject(StorageService);

  private readonly _favourites = signal<Favourite[]>(this.loadFavourites());
  readonly favourites = this._favourites.asReadonly();

  favouritedPropertyIds(userId: string) {
    return computed(() => new Set(this._favourites().filter((f) => f.userId === userId).map((f) => f.propertyId)));
  }

  isFavourite(userId: string, propertyId: string): boolean {
    return this._favourites().some((f) => f.userId === userId && f.propertyId === propertyId);
  }

  toggle(userId: string, propertyId: string): void {
    if (this.isFavourite(userId, propertyId)) {
      this.remove(userId, propertyId);
    } else {
      this.add(userId, propertyId);
    }
  }

  add(userId: string, propertyId: string): void {
    if (this.isFavourite(userId, propertyId)) {
      return;
    }
    const newFavourite: Favourite = { userId, propertyId, createdAt: nowIso() };
    this.persist([...this._favourites(), newFavourite]);
  }

  remove(userId: string, propertyId: string): void {
    this.persist(this._favourites().filter((f) => !(f.userId === userId && f.propertyId === propertyId)));
  }

  getFavouritePropertyIdsFor(userId: string): string[] {
    return this._favourites().filter((f) => f.userId === userId).map((f) => f.propertyId);
  }

  private persist(favourites: Favourite[]): void {
    this.storage.setItem(FAVOURITES_KEY, favourites);
    this._favourites.set(favourites);
  }

  private loadFavourites(): Favourite[] {
    return this.storage.getItem<Favourite[]>(FAVOURITES_KEY) ?? [];
  }
}
