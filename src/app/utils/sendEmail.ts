import config from '../config';
import { compileTemplate } from './compileTemplete';
import sgMail from '@sendgrid/mail';

type TSendEmail = {
  to: string;
  subject: string;
  templateName: string;
  emailData: Record<string, unknown>;
};

sgMail.setApiKey(config.SENDGRID_API_KEY as string);

export const sendEmail = async ({
  to,
  subject,
  templateName,
  emailData,
}: TSendEmail) => {
  const htmlContent = compileTemplate({ templateName, emailData });

  await sgMail.send({
    to,
    from: config.SENDER_EMAIL as string,
    subject,
    html: htmlContent,
  });
};
