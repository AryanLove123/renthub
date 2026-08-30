import { Component, computed, inject, signal } from '@angular/core';
import { PropertySearchComponent, SearchQuery } from '../../components/property-search/property-search';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state';
import { PropertyCardComponent } from '../../components/property-card/property-card';
import { PropertyFiltersComponent } from '../../components/property-filters/property-filters';
import { PropertyFilters, PropertySortOption } from '../../models/property-filters.model';
import { PropertyService } from '../../services/property.service';
import { AuthService } from '../../../../core/services/auth.service';
import { FavouriteService } from '../../../favourites/services/favourite';

@Component({
  selector: 'app-property-listings',
  imports: [PropertySearchComponent, EmptyStateComponent, PropertyCardComponent, PropertyFiltersComponent, MatIconModule, MatFormFieldModule, MatSelectModule, MatPaginatorModule, ],
  templateUrl: './property-listings.html',
  styleUrl: './property-listings.scss',
})
export class PropertyListingsComponent {
  filtersOpen = signal(false);
  


  searchQuery: SearchQuery = {};
  propertyFilters: PropertyFilters = {};

  authService = inject(AuthService);
  favService = inject(FavouriteService);
  propertyService = inject(PropertyService);
  favouriteIds = computed(() => {
    const userId = this.authService.currentUser()?.id;
    return userId ? this.favService.favouritedPropertyIds(userId)() : new Set<string>();
  });
  pagedProperties = this.propertyService.pagedProperties;
  sortOption = this.propertyService.sortOption;
  totalResults = computed(() => this.propertyService.filteredAndSortedProperties().length);
  currentPage = this.propertyService.currentPage;
  pageSize = this.propertyService.pageSize;


  onSearchHandler(query: SearchQuery){
    this.searchQuery = query;
    console.log("this is my search query",this.searchQuery)
  }

  onFiltersChangedHandler(filters: PropertyFilters){
    this.propertyFilters = filters;
    this.applyCombinedFilters();
  }

  onSortChange(sort: PropertySortOption): void{
    this.propertyService.setSortOption(sort);
  }

  onPageChange(event: PageEvent): void {
    this.propertyService.setPage(event.pageIndex + 1);
    document.getElementById('listing-results')?.scrollIntoView({ behavior: 'smooth' });
  }

  applyCombinedFilters(): void {
    const combined: PropertyFilters = {
      ...this.propertyFilters,
      ...this.searchQuery,
    }
    this.propertyService.setFilters(combined);
  }

  onClickFavIconHandler(propertyId: string): void {
    const user = this.authService.currentUser();
    if(user){
      this.favService.toggle(user.id, propertyId);
    }
  }
}
