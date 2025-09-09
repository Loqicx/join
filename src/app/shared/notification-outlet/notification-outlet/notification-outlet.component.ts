import { Component } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { Notification } from '../../interfaces/notification';

@Component({
    selector: 'notification-outlet',
    imports: [],
    templateUrl: './notification-outlet.component.html',
    styleUrl: './notification-outlet.component.scss',
})
export class NotificationOutletComponent {
    private notifications: HTMLElement[] = [];

    notificationListener;

    constructor(private notificationService: NotificationService) {
        this.notificationListener = this.notificationService.notificationSubject$.subscribe((data) => {});
    }

    addNotification(notificationData: Notification) {
        const { message, type, position, duration } = notificationData;
        const notification = document.createElement('div');
        notification.classList.add('notification', type);
        notification.textContent = message;
        notification.setAttribute('data-position', position);
        document.body.appendChild(notification);
        this.notifications.push(notification);
    }
}
