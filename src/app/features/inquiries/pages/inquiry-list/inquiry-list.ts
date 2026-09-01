import { Component, computed, inject, signal } from '@angular/core';
import { InquiryService } from '../../services/inquiry.service';
import { PropertyService } from '../../../listings/services/property.service';
import { AuthService } from '../../../../core/services/auth.service';
import { InquiryMessage } from '../../models/inquiry.model';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-inquiry-list',
  imports: [MatIconModule, MatCardModule, MatChipsModule, RouterLink],
  templateUrl: './inquiry-list.html',
  styleUrl: './inquiry-list.scss',
})
export class InquiryListComponent {
  inquiryService = inject(InquiryService);
  propertyService = inject(PropertyService);
  authService = inject(AuthService);

  currentUser = this.authService.currentUser;

  selectedInquiryId = signal<string | null>(null);
  replyMessageText = signal<string>('');
  isSending = signal<boolean>(false);

  userInquiries = computed(() => {
    const user = this.currentUser();
    if (!user) return [];
    
    this.inquiryService.inquiries(); 
    return this.inquiryService.getUserInquiries(user.id);
  });

  getPropertyTitle(propertyId: string): string {
    const prop = this.propertyService.getPropertyById(propertyId);
    return prop ? prop.title : 'Property Listing';
  }

  otherPartyName(renterId: string, landlordId: string): string {
    const me = this.currentUser();
    if (!me) return '';
    const otherId = me.id === landlordId ? renterId : landlordId;
    const other = this.authService.getUsers().find((u) => u.id === otherId);
    return other ? `${other.firstName} ${other.lastName || ''}`.trim() : 'User';
  }

  getLastMessage(inquiryId: string): string {
    const messages = this.inquiryService.getInquiryMessages(inquiryId);
    if (messages.length === 0) return 'No messages yet.';
    return messages[messages.length - 1].message;
  }

  formatDate(isoDate: string): string {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }
}
