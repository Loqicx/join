/**
 * @fileoverview Notification outlet component for displaying system notifications
 */

import { Component } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { Notification, NotificationPosition } from '../../interfaces/notification';

/**
 * Component for displaying notifications in various positions on the screen
 * @component
 */
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
        this.notificationListener = this.notificationService.notificationSubject$.subscribe((data) => {
            if (data.message === '') return;
            this.addNotification(data);
        });
    }

    addNotification(notificationData: Notification) {
        const { message, type, position, duration } = notificationData;
        const fadeInDuration = duration * 0.1;
        const fadeOutDuration = duration * 0.2;
        const visibleDuration = duration - fadeInDuration - fadeOutDuration;
        const notification = document.createElement('div');
        notification.classList.add('notification', type);
        notification.textContent = message;
        notification.setAttribute('data-position', position);
        notification.style.setProperty('--fade-in-duration', `${fadeInDuration}ms`);
        notification.style.setProperty('--fade-out-duration', `${fadeOutDuration}ms`);
        notification.style.setProperty('--fade-out-delay', `${visibleDuration + fadeInDuration}ms`);
        document.body.appendChild(notification);
        this.notifications.push(notification);

        switch (position) {
            case NotificationPosition.TOP_RIGHT:
                notification.style.top = `${20 + (this.notifications.length - 1) * 50}px`;
                notification.style.right = '20px';
                break;
            case NotificationPosition.TOP_LEFT:
                notification.style.top = `${20 + (this.notifications.length - 1) * 60}px`;
                notification.style.left = '20px';
                break;
            case NotificationPosition.BOTTOM_RIGHT:
                notification.style.bottom = `${20 + (this.notifications.length - 1) * 60}px`;
                notification.style.right = '20px';
                break;
            case NotificationPosition.BOTTOM_LEFT:
                notification.style.bottom = `${20 + (this.notifications.length - 1) * 60}px`;
                notification.style.left = '20px';
                break;
        }

        setTimeout(() => {
            notification.remove();
            this.notifications.splice(this.notifications.indexOf(notification), 1);
            this.rearangeNotifications();
        }, duration);
    }

    private rearangeNotifications() {
        this.notifications.forEach((notification, index) => {
            const position = notification.getAttribute('data-position');
            switch (position) {
                case NotificationPosition.TOP_RIGHT:
                    notification.style.top = `${20 + index * 60}px`;
                    notification.style.right = '20px';
                    notification.style.left = '';
                    notification.style.bottom = '';
                    break;
                case NotificationPosition.TOP_LEFT:
                    notification.style.top = `${20 + index * 60}px`;
                    notification.style.left = '20px';
                    notification.style.right = '';
                    notification.style.bottom = '';
                    break;
                case NotificationPosition.BOTTOM_RIGHT:
                    notification.style.bottom = `${20 + index * 60}px`;
                    notification.style.right = '20px';
                    notification.style.left = '';
                    notification.style.top = '';
                    break;
                case NotificationPosition.BOTTOM_LEFT:
                    notification.style.bottom = `${20 + index * 60}px`;
                    notification.style.left = '20px';
                    notification.style.right = '';
                    notification.style.top = '';
                    break;
            }
        });
    }

    ngOnDestroy() {
        this.notificationListener.unsubscribe();
    }
}
