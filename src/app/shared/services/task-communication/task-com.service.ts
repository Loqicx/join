import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class TaskComService {
    taskChanged = new BehaviorSubject(0);
    taskChanged$ = this.taskChanged.asObservable();

    triggerTaskChange(value: number) {
        this.taskChanged.next(value);
    }

    constructor() {}
}
