import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { SendEmailDto } from './mail.interface';
import { Mail } from "nodemailer/lib/mailer"

@Injectable()
export class MailerService {
    constructor(private readonly configService: ConfigService) { }
    mailTransport() {
        const transporter = nodemailer.createTransport({
            host: this.configService.get<string>('MAIL_HOST'),
            port: this.configService.get<string>('MAIL_PORT'),
            secure: false, // true for port 465, false for other ports
            auth: {
                user: this.configService.get<string>('MAIL_USER'),
                pass: this.configService.get<string>('MAIL_PASSWORD'),
            },
        });
        return transporter;
    }

    template(html: string, replacement: Record<string, string>) {
        return html.replace(
            /%(\w*)%/g,
            function (m, key) {
                return replacement.hasOwnProperty(key) ? replacement[key] : "";
            }
        )
    }

    async sendEmail(dto: SendEmailDto) {
        const { from, recepients, subject } = dto;
        const html = dto.placeholderRelacements ? this.template(dto.html, dto.placeholderRelacements) : dto.html;
        const transport = this.mailTransport();
        const options: Mail.options = {
            from: from ?? {
                name: this.configService.get<string>('APP_NAME'),
                address: this.configService.get<string>('DEFAULT_MAIL_FROM'),
            },
            to: recepients,
            subject,
            html
        }
        try {
            const result = await transport.sendMail(options);
            return result;
        } catch (error) {
            console.error('Error:', error);
        }
    }
}
