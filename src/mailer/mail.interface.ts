import { Address } from "nodemailer/lib/mailer"

export type SendEmailDto = {
    from?: Address;
    recepients: Address[];
    subject: string;
    html:string;
    text?:string;
    placeholderRelacements?: Record<string, string>;
}