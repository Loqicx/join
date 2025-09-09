export enum NotificationType {
    SUCCESS = 'success',
    ERROR = 'error',
    WARNING = 'warning',
}

export enum NotificationPosition {
    TOP_RIGHT = 'top-right',
    TOP_LEFT = 'top-left',
    BOTTOM_LEFT = 'bottom-left',
    BOTTOM_RIGHT = 'bottom-right',
}

export interface Notification {
    message: string;
    type: NotificationType;
    position: NotificationPosition;
    duration: number;
}
