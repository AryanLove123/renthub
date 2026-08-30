import { Component, Input } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div class="empty-state" role="status">
      <mat-icon class="empty-state__icon" aria-hidden="true">{{ icon }}</mat-icon>
      <h3 class="empty-state__title">{{ title }}</h3>
      @if (message) {
        <p class="empty-state__message">{{ message }}</p>
      }
      <ng-content></ng-content>
    </div>
  `,
  styles: [
    `
      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        padding: 48px 24px;
        color: var(--rh-text-secondary);
      }
      .empty-state__icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        margin-bottom: 12px;
        color: var(--rh-primary-light);
      }
      .empty-state__title {
        margin: 0 0 6px;
        font-size: 1.1rem;
        font-weight: 600;
        color: var(--rh-text-primary);
      }
      .empty-state__message {
        margin: 0 0 16px;
        max-width: 360px;
      }
    `,
  ],
})
export class EmptyStateComponent {
  @Input() icon = 'inbox';
  @Input() title = 'Nothing here yet';
  @Input() message = '';
}
