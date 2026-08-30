import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Property, PropertyStatus } from '../../models/property.model';
import { RouterLink } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { EnumLabelPipe } from '../../../../shared/pipes/enum-label.pipe';

@Component({
  selector: 'app-property-card',
  imports: [RouterLink, MatButtonModule, MatIconModule, MatCardModule, MatChipsModule, EnumLabelPipe],
  templateUrl: './property-card.html',
  styleUrl: './property-card.scss',
})
export class PropertyCardComponent {
  @Input() property!: Property;
  @Input() isFav:boolean = false;
  @Input() showFavIcon:boolean = true;
  @Input() showLandlordActions = false;

  @Output() onClickFavIcon = new EventEmitter<string>();
  @Output() editRequested = new EventEmitter<string>();
  @Output() deleteRequested = new EventEmitter<string>();

  PropertyStatus = PropertyStatus;

  onClickFavIconHandler(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.onClickFavIcon.emit(this.property.id);
  }

  onEditClick(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.editRequested.emit(this.property.id);
  }

  onDeleteClick(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.deleteRequested.emit(this.property.id);
  }
}
