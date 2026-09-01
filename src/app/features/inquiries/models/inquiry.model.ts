export enum InquiryStatus {
  PENDING = 'PENDING',
  RESPONDED = 'RESPONDED',
  CLOSED = 'CLOSED',
}

export interface Inquiry {
  id: string;
  propertyId: string;
  renterId: string;
  landlordId: string;
  status: InquiryStatus;
  createdAt: string;
  updatedAt: string;
}

export interface InquiryMessage {
  id: string;
  inquiryId: string;
  senderId: string;
  message: string;
  createdAt: string;
}