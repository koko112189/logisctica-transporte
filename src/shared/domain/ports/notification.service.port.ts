export const NOTIFICATION_SERVICE = 'NOTIFICATION_SERVICE';

export interface SendEmailParams {
  to: string;
  subject: string;
  body: string;
}

export interface INotificationService {
  sendEmail(params: SendEmailParams): Promise<void>;
}
