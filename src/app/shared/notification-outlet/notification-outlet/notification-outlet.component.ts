import { Component } from '@angular/core';
import { NotificationService } from '../../services/notification.service';

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
}
