import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatAnchor } from '@angular/material/button';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export interface SearchQuery {
  keyword?: string;
  city?: string;
}

@Component({
  selector: 'app-property-search',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatIconModule, MatInput, MatAnchor],
  templateUrl: './property-search.html',
  styleUrl: './property-search.scss',
})
export class PropertySearchComponent {
  @Output() clickSearch = new EventEmitter<SearchQuery>();

  fb = inject(FormBuilder);
  searchForm = this.fb.group({
    keyword: [''],
    city: [''],
  });

  constructor() {
    this.searchForm.valueChanges
      .pipe(
        debounceTime(350),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.emitSearch());
  }

  emitSearch() {
    const formVal = this.searchForm.getRawValue();
    this.clickSearch.emit({ keyword: formVal.keyword ?? '', city: formVal.city ?? '' });
  }
}

// this.onSearch.emit({keyword: formVal.keyword ?? '', city: formVal.city ?? ''});
