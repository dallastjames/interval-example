import { Component, OnInit, OnDestroy } from '@angular/core';
import { interval, Subscription, merge } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';
import { NumberService } from './number.service';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit, OnDestroy {
    // Every 2 seconds
    public timeDelay = 2 * 1000;

    // Interval
    private intervalSub: Subscription;
    public numberChecks = 0;

    // Push
    public id1 = 'some-id';
    public number$ = this.numberService.getById(this.id1);
    public nextNumber: FormControl = new FormControl();

    // Push + Interval
    private intervalSub2: Subscription;
    public id2 = 'some-id2';
    public nextNumber2: FormControl = new FormControl();
    public number2$ = merge(this.numberService.getById(this.id2));

    constructor(private numberService: NumberService) {}

    ngOnInit(): void {
        // This triggers the subscription immediately.
        // If you remove the startWith line, the subscription wont fire until after
        // the initial timeDelay passes
        this.intervalSub = interval(this.timeDelay)
            .pipe(startWith(0))
            .subscribe(() => {
                this.numberChecks += 1;
            });

        // Note that this second interval does not have a startWith operator.
        // This means that it will start out being a single count behind the other
        this.intervalSub2 = interval(this.timeDelay).subscribe(() => {
            this.numberService.nextNumber(
                this.id2,
                this.numberService.getLastValueById(this.id2) + 1
            );
        });
    }

    ngOnDestroy(): void {
        // Make sure we unsubscribe from these!
        this.intervalSub?.unsubscribe();
        this.intervalSub2?.unsubscribe();
    }

    public pushNumber(id: string, numberControl: FormControl): void {
        const radix = 10;
        const value = parseInt(numberControl.value, radix);
        numberControl.reset();
        // This would simulate receiving the number from an outside
        // source, such as a push notification
        this.numberService.nextNumber(id, value);
    }
}
