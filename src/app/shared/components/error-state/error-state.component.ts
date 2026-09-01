import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-error-state',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  template: `
    <div class="error-state">
      <mat-icon class="error-state-icon">error_outline</mat-icon>
      <h3 class="error-state-title">{{ title }}</h3>
      <p class="error-state-message">{{ message }}</p>

      @if (showRetry) {
        <button mat-stoked-button color="primary" (click)="retry.emit()">Try again</button>
      }
    </div>
  `,
  styles: [
    `
      .error-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        padding: 48px 24px;
      }
      .error-state-icon {
        font-size: 44px;
        width: 44px;
        height: 44px;
        color: var(--rh-error);
        margin-bottom: 8px;
      }
      .error-state__title {
        margin: 0 0 4px;
        font-weight: 600;
      }
      .error-state__message {
        margin: 0 0 16px;
        color: var(--rh-text-secondary);
        max-width: 360px;
      }
    `,
  ],
})
export class ErrorStateComponent {
  @Input() title = ' Something went wrong';
  @Input() message = 'Please try again in sometime';
  @Input() showRetry = true;
  @Output() retry = new EventEmitter<void>();
}
