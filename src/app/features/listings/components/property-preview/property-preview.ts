import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { PropertyDraft } from '../../../../shared/utils/property-form.utils';
import { MatChipsModule } from '@angular/material/chips';
import { MatAnchor } from "@angular/material/button";

@Component({
  selector: 'app-property-preview',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatChipsModule,
    MatAnchor
],
  templateUrl: './property-preview.html',
  styleUrl: './property-preview.scss',
})
export class PropertyPreviewComponent {
  @Input() draft!: PropertyDraft;
  @Input() isSubmitting = false;

  @Output() isEditRequested = new EventEmitter<void>();
  @Output() isConfirmed = new EventEmitter<void>();
}
