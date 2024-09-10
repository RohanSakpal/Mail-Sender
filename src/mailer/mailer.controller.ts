import { Body, Controller, Post } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { SendEmailDto } from './mail.interface';

@Controller('mailer')
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}

  @Post('/send-email')
  async sendMail(@Body() body: Record<string, string>) {
    const dto: SendEmailDto = {
      from: {name: 'Mailtrap Test', address: 'mailtrap@example.com'},
      recepients: [{name: 'Rohan Sakpal', address: 'rohan.sakpal@atriina.com'}],
      subject: 'Lucky Winner',
      html: '<p><string>Hi %name%</strong>, your lucky number is %number%</p>',
      placeholderRelacements: body,
    }
    return await this.mailerService.sendEmail(dto);
  }
}
