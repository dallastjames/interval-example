import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class NumberService {
    private numbersById: { [key: string]: BehaviorSubject<number> } = {};

    public nextNumber(id: string, nextValue: number): void {
        if (this.numbersById[id]) {
            this.numbersById[id].next(nextValue);
        } else {
            this.numbersById[id] = this.newSubject(nextValue);
        }
    }

    public getById(id: string): Observable<number> {
        if (!this.numbersById[id]) {
            this.numbersById[id] = this.newSubject(0);
        }
        return this.numbersById[id].asObservable();
    }

    public getLastValueById(id: string): number {
        if (!this.numbersById[id]) {
            return 0;
        } else {
            return this.numbersById[id].getValue();
        }
    }

    private newSubject(initValue: number): BehaviorSubject<number> {
        return new BehaviorSubject<number>(initValue);
    }
}
