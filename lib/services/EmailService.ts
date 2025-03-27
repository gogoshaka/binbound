import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

export class EmailService {
  private static instance: EmailService;
  private client: SESClient;

  private constructor() {
    this.client = new SESClient({
      region: process.env.AWS_SES_REGION!,
      credentials: {
        accessKeyId: process.env.AWS_SES_ACCESS_KEY!,
        secretAccessKey: process.env.AWS_SES_SECRET!
      },
    });
  }

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  public async sendEmail(params : {subject: string, body: string, to: string, from: string}): Promise<boolean> {
    const input = { // SendEmailRequest
        Source: params.from,
        Destination: {
          ToAddresses: [params.to],
        },
        Message: { 
          Subject: { 
            Data: params.subject, 
          },
          Body: { // Body
            Text: {
              Data: params.body,
            },
          },
        }
      };
      console.log(input)
    const command = new SendEmailCommand(input);
    try {
      const data = await this.client.send(command);
      console.log(data);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
