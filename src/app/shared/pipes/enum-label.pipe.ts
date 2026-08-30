import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generic fallback for turning any SCREAMING_SNAKE_CASE enum value into a
 * readable label ('INDEPENDENT_HOUSE' -> 'Independent House'). Used for
 * enums where a bespoke label map (like AmenityLabelPipe) isn't worth the
 * extra file - property type, furnishing status, lease type, statuses.
 */
@Pipe({
  name: 'enumLabel',
  standalone: true,
})
export class EnumLabelPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) {
      return '';
    }
    return value
      .toLowerCase()
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
