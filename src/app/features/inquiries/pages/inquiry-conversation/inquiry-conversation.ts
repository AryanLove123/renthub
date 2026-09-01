import { Component, computed, effect, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { InquiryService } from '../../services/inquiry.service';
import { PropertyService } from '../../../listings/services/property.service';
import { AuthService } from '../../../../core/services/auth.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-inquiry-conversation',
  imports: [MatIconModule, RouterLink],
  templateUrl: './inquiry-conversation.html',
  styleUrl: './inquiry-conversation.scss',
})
export class InquiryConversationComponent {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private inquiryService = inject(InquiryService);
  private propertyService = inject(PropertyService);
  private authService = inject(AuthService);

  currentUser = this.authService.currentUser;
  inquiryId = signal<string | null>(null);
  messageText = signal<string>('');
  isSending = signal<boolean>(false);

  constructor() {
    this.route.paramMap.subscribe((params) => {
      this.inquiryId.set(params.get('inquiryId'));
    });

    // Auto scroll chat to bottom on new message load
    effect(() => {
      this.activeMessages();
      setTimeout(() => this.scrollToBottom(), 50);
    });
  }

  // Fetch the current inquiry record
  inquiry = computed(() => {
    const id = this.inquiryId();
    if (!id) return null;
    return this.inquiryService.getInquiryById(id) ?? null;
  });

  property = computed(() => {
    const inq = this.inquiry();
    if (!inq) return null;
    return this.propertyService.getPropertyById(inq.propertyId);
  });

  isParticipant = computed(() => {
    const inq = this.inquiry();
    const me = this.currentUser();
    return !!inq && !!me && (me.id === inq.renterId || me.id === inq.landlordId);
  });

  otherPartyName = computed(() => {
    const inq = this.inquiry();
    const me = this.currentUser();
    if (!inq || !me) return 'User';
    const otherUserId = me.id === inq.landlordId ? inq.renterId : inq.landlordId;
    const otherUser = this.authService.getUsers().find((u) => u.id === otherUserId);
    return otherUser ? `${otherUser.firstName} ${otherUser.lastName || ''}`.trim() : 'User';
  });

  activeMessages = computed(() => {
    const id = this.inquiryId();
    if (!id) return [];
    this.inquiryService.messages();
    return this.inquiryService.getInquiryMessages(id);
  });

  onEnter(event: Event): void {
    event.preventDefault();
    this.sendMessage();
  }

  sendMessage(): void {
    const text = this.messageText().trim();
    const id = this.inquiryId();
    const user = this.currentUser();

    if (!text || !id || !user || this.isSending()) return;

    this.isSending.set(true);

    this.inquiryService.sendMessage(id, user.id, text).subscribe({
      next: () => {
        this.messageText.set('');
        this.isSending.set(false);
      },
      error: (err) => {
        console.error('Failed to send message:', err);
        this.isSending.set(false);
      },
    });
  }

  getSenderName(senderId: string): string {
    const me = this.currentUser();
    if (me && senderId === me.id) {
      return `${me.firstName} ${me.lastName || ''}`.trim();
    }
    return this.otherPartyName();
  }

  formatTime(isoDate: string): string {
    return new Date(isoDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  private scrollToBottom(): void {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollTop =
        this.scrollContainer.nativeElement.scrollHeight;
    }
  }
}
