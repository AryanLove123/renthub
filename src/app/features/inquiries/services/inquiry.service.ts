import { inject, Injectable, signal } from '@angular/core';
import { StorageService } from '../../../core/services/storage.service';
import { Inquiry, InquiryMessage, InquiryStatus } from '../models/inquiry.model';
import { Observable, of, throwError } from 'rxjs';
import { generateId, nowIso } from '../../../shared/utils/id.utils';


const INQUIRIES_KEY = 'renthub_inquiries';
const MESSAGES_KEY = 'renthub_inquiry_messages';

@Injectable({
  providedIn: 'root',
})
export class InquiryService {
  storage = inject(StorageService);
  inquiries =  signal<Inquiry[]>(this.loadInquiries());
  messages = signal<InquiryMessage[]>(this.loadMessages());

  getInquiryById(inquiryId: string): Inquiry | undefined {
    return this.inquiries().find((i) => i.id === inquiryId);
  }

  getUserInquiries(userId: string): Inquiry[] {
    return this.inquiries()
      .filter((i) => i.renterId === userId || i.landlordId === userId)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  getInquiryMessages(inquiryId: string): InquiryMessage[] {
    return this.messages()
      .filter((m) => m.inquiryId === inquiryId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  findExistingInquiry(propertyId: string, renterId: string): Inquiry | undefined{
    return this.inquiries().find((i) => i.propertyId == propertyId && i.renterId == renterId);

  }

  startInquiry(propertyId: string, renterId: string, landlordId: string, message: string):Observable<Inquiry>{
    let inquiry = this.findExistingInquiry(propertyId, renterId);

    if(!inquiry){
      inquiry ={
        id: generateId('inquiry'),
        propertyId,
        renterId,
        landlordId,
        status: InquiryStatus.PENDING,
        createdAt:nowIso(),
        updatedAt: nowIso(),
      };
      this.persitInquiries([...this.inquiries(), inquiry]);
    }
    this.appendMessage(inquiry.id, renterId, message);
    return of(inquiry);
  }

  sendMessage(inquiryId: string, senderId: string, message: string): Observable<InquiryMessage>{
    const inquiry = this.getInquiryById(inquiryId);
    if (!inquiry) {
      return throwError(() => new Error('Inquiry not found.'));
    }

    if (inquiry.renterId !== senderId && inquiry.landlordId !== senderId) {
      return throwError(() => new Error('You are not part of this conversation.'));
    }

    const newMessage = this.appendMessage(inquiryId, senderId, message);

    const nextStatus = senderId === inquiry.landlordId ? InquiryStatus.RESPONDED : inquiry.status;
    this.persitInquiries(
      this.inquiries().map((i) => (i.id === inquiryId ? { ...i, status: nextStatus, updatedAt: nowIso() } : i)),
    );

    return of(newMessage);
  }

  appendMessage(inquiryId: string, senderId: string, message: string): InquiryMessage{
    const newMessage: InquiryMessage = {
      id: generateId('msg'),
      inquiryId,
      senderId,
      message: message.trim(),
      createdAt: nowIso(),
    };
    this.persistMessages([...this.messages(), newMessage]);
    return newMessage;
  }


  persitInquiries(inquiries: Inquiry[]): void {
    this.storage.setItem(INQUIRIES_KEY, inquiries);
    this.inquiries.set(inquiries);
  }

  persistMessages(messages: InquiryMessage[]): void{
    this.storage.setItem(MESSAGES_KEY,messages);
    this.messages.set(messages);
  }

  loadInquiries(): Inquiry[] {
    return this.storage.getItem<Inquiry[]>(INQUIRIES_KEY) ?? [];
  }

  loadMessages(): InquiryMessage[] {
    return this.storage.getItem<InquiryMessage[]>(MESSAGES_KEY) ?? [];
  } 
}
