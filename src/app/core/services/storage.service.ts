import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class StorageService {
    getItem<T>(key: string): T | null {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) as T : null;
    }

    setItem<T>(key: string, value: T): void {
        localStorage.setItem(key, JSON.stringify(value));
    }

    removeItem(key: string): void {
        localStorage.removeItem(key);
    }

    seedIfEmpty<T>(key: string, seedValue: T): void {
    if (localStorage.getItem(key) === null) {
      this.setItem(key, seedValue);
    }
  }
}