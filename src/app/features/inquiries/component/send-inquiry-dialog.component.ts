import { Component, Inject, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { InquiryService } from '../services/inquiry.service';
import { MatInputModule } from '@angular/material/input';

export interface SendInquiryDialogData {
  propertyId: string;
  propertyTitle: string;
  renterId: string;
  landlordId: string;
}

@Component({
  selector: 'app-send-inquiry-dialog',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, ReactiveFormsModule, MatButtonModule, MatInputModule],
  template: `
    <h2 mat-dialog-title>Contact Landlord</h2>
    <mat-dialog-content>
      <p class="dialog-hint">
        Your message about <strong>{{ data.propertyTitle }}</strong> is private and visible only to
        you and the landlord. Use this for move-in details, rent negotiation, or anything personal.
      </p>
      <form [formGroup]="form">
        <mat-form-field appearance="outline" class="dialog-field">
          <mat-label>Your message</mat-label>
          <textarea
            matInput
            formControlName="message"
            rows="4"
            placeholder="e.g. I'm interested in renting from next month. Would you consider a slightly lower rent for a 12-month lease?"
          ></textarea>
          @if (form.controls.message.touched && form.controls.message.hasError('required')) {
            <mat-error>Please write a message.</mat-error>
          }
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close(false)">Cancel</button>
      <button mat-flat-button color="primary" [disabled]="isSubmitting()" (click)="onSend()">
        {{ isSubmitting() ? 'Sending...' : 'Send Inquiry' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      .dialog-hint {
        color: var(--rh-text-secondary);
        font-size: 0.88rem;
        margin-bottom: 12px;
      }
      .dialog-field {
        width: 100%;
        min-width: 340px;
      }
    `,
  ],
})
export class SendInquiryDialogComponent {
  inquiryService = inject(InquiryService);
  fb = inject(FormBuilder);
  isSubmitting = signal(false);
  form = this.fb.group({
    message: ['', [Validators.required, Validators.minLength(3)]],
  });

  constructor(
    public dialogRef: MatDialogRef<SendInquiryDialogComponent, boolean>,
    @Inject(MAT_DIALOG_DATA) public data: SendInquiryDialogData,
  ) {}

  onSend(): void{
    this.isSubmitting.set(true);
    const message = this.form.controls.message.value!;

    this.inquiryService.startInquiry(this.data.propertyId, this.data.renterId, this.data.landlordId, message).subscribe({
        next: () => {
        this.isSubmitting.set(false);
        this.dialogRef.close(true);
      },
      error: (err: Error) => {
        this.isSubmitting.set(false);
      },
    });
  }
}
