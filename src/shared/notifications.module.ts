import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NOTIFICATION_SERVICE } from './domain/ports/notification.service.port';
import { EmailNotificationService } from './infrastructure/notifications/email.notification.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: NOTIFICATION_SERVICE,
      useClass: EmailNotificationService,
    },
  ],
  exports: [NOTIFICATION_SERVICE],
})
export class NotificationsModule {}
