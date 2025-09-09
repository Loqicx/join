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

    pushNotification(message: string, type: NotificationType, position: NotificationPosition, duration: number = 4000) {
        const notification = { message: message, type: type, position: position, duration: duration };
        this.notificationSubject.next(notification);
    }
}
