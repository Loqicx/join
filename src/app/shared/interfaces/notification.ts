export enum NotificationType {
    SUCCESS = 'success',
    ERROR = 'error',
    WARNING = 'warning',
}

export interface Notification {
    message: string;
    type: NotificationType;
    position: NotificationPosition;
    duration: number;
}
