import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { UserRole } from '../../../core/models/user.model';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink, RouterLinkActive, MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class NavbarComponent {
  authService = inject(AuthService);
  router = inject(Router);

  userRole = UserRole;
  currentUser = this.authService.currentUser;
  isAuthenticated = this.authService.isAuthenticated;
  isLandlord = this.authService.isLandlord;

  isMobileMenuOpen =signal(false);

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update((open) => !open);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }

  logout(): void {
    this.authService.logout();
    this.closeMobileMenu();
    this.router.navigate(['/']);
  }
}
