import { inject, Injectable, signal } from "@angular/core";
import { StorageService } from "../../../core/services/storage.service";
import { Property, PropertyStatus } from "../models/property.model";
import { PropertyDraft } from "../../../shared/utils/property-form.utils";
import { generateId, nowIso } from "../../../shared/utils/id.utils";
import { Observable, of } from "rxjs";

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

    create(draft:PropertyDraft, landlordId:string) : Observable<Property>{
        const newProperty: Property = {
            ...draft,
            id:generateId('Property'),
            landlordId,
            propertyStatus: PropertyStatus.Available,
            createdAt: nowIso(),
            updatedAt: nowIso()
        }

        const updated = [...this.properties(), newProperty];
        this.persistProperties(updated);
        return of(newProperty);
    }
}
