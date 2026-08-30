import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'inrCurrency',
  standalone: true,
})
export class InrCurrencyPipe implements PipeTransform {
  formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  });

  transform(value: number | null | undefined, suffix = ''): string {
    if (value === null || value === undefined) {
      return '—';
    }
    return `${this.formatter.format(value)}${suffix}`;
  }
}
