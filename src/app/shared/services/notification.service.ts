import { Injectable } from '@angular/core';
import { Notification, NotificationPosition, NotificationType } from '../interfaces/notification';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class NotificationService {
    initialNotification: Notification = {
        message: '',
        type: NotificationType.SUCCESS,
        position: NotificationPosition.TOP_RIGHT,
        duration: 4000,
    };
    notificationSubject = new BehaviorSubject<Notification>(this.initialNotification);
    notificationSubject$ = this.notificationSubject.asObservable();
    constructor() {}
}
