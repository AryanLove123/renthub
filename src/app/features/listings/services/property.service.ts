import { inject, Injectable, signal } from "@angular/core";
import { StorageService } from "../../../core/services/storage.service";
import { Property } from "../models/property.model";

const PROPERTIES_KEY = 'renthub_properties';
@Injectable({providedIn: 'root'})
export class PropertyService{
    storageService = inject(StorageService);
    properties = signal<Property[]>(this.loadProperties());

    loadProperties(): Property[]{
        return this.storageService.getItem<Property[]>(PROPERTIES_KEY) ?? [];
    }

    persistProperties(properties: Property[]): void{
        this.storageService.setItem(PROPERTIES_KEY,properties);
        this.properties.set(properties);
    }
}
