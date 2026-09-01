import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./features/listings/pages/property-listings/property-listings').then(m => m.PropertyListingsComponent)
    },
    {
        path: 'register',
        loadComponent: () => import('./features/auth/pages/register/register').then(m => m.RegisterComponent)
    },
    {
        path: 'login',
        loadComponent: () => import('./features/auth/pages/login/login').then(m => m.LoginComponent)
    },
    {
        path: 'favourites',
        loadComponent: () => import('./features/favourites/pages/favourites/favourites').then(m => m.FavouritesComponent)
    },
    {
        path: 'listings/:id',
        loadComponent: () => import('./features/listings/pages/listing-detail/listing-detail').then(m => m.ListingDetailComponent)
    },
    {
        path: 'landlord/listings',
        loadComponent: () => import('./features/listings/pages/my-listings/my-listings').then(m => m.MyListingsComponent)
    },
    {
        path: 'landlord/listings/create',
        loadComponent: () => import('./features/listings/pages/create-listing/create-listing').then(m => m.CreateListingComponent)
    },
    {
        path: 'landlord/listings/:id/edit',
        loadComponent: () => import('./features/listings/pages/edit-listing/edit-listing').then(m =>m.EditListingComponent)
    },
    {
        path: 'inquiries',
        loadComponent: () => import('./features/inquiries/pages/inquiry-list/inquiry-list').then(m => m.InquiryListComponent)
    },
    {
        path: 'inquiries/:inquiryId',
        loadComponent: () => import('./features/inquiries/pages/inquiry-conversation/inquiry-conversation').then(m => m.InquiryConversationComponent)
    },
    
];
