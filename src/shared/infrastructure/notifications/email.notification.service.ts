import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import type {
  INotificationService,
  SendEmailParams,
} from '../../domain/ports/notification.service.port';

@Injectable()
export class EmailNotificationService implements INotificationService {
  private readonly logger = new Logger(EmailNotificationService.name);
  private readonly transporter: nodemailer.Transporter | null;
  private readonly from: string;

  constructor(private readonly config: ConfigService) {
    const host = config.get<string>('MAIL_HOST');
    this.from = config.get<string>('MAIL_FROM', 'Calypso TMS <noreply@calypso.co>');

    if (host) {
      this.transporter = nodemailer.createTransport({
        host,
        port: config.get<number>('MAIL_PORT', 587),
        auth: {
          user: config.get<string>('MAIL_USER'),
          pass: config.get<string>('MAIL_PASS'),
        },
      });
    } else {
      this.transporter = null;
      this.logger.warn('MAIL_HOST no configurado — emails se registrarán en consola');
    }
  }

  async sendEmail(params: SendEmailParams): Promise<void> {
    if (!this.transporter) {
      this.logger.log(
        `[EMAIL SIMULADO] To: ${params.to} | Subject: ${params.subject}`,
      );
      return;
    }
    try {
      await this.transporter.sendMail({
        from: this.from,
        to: params.to,
        subject: params.subject,
        html: params.body,
      });
    } catch (err) {
      this.logger.error(`Error enviando email a ${params.to}`, err);
    }
  }
}
