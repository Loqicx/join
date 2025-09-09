import { Injectable } from '@angular/core';
import { Notification, NotificationPosition, NotificationType } from '../interfaces/notification';

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
    constructor() {}
}
