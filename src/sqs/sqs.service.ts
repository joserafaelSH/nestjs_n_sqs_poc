import { IEnvironmentVariables } from '@/config/environment/environment.interface';
import {
  CreateQueueCommand,
  DeleteMessageCommand,
  DeleteQueueCommand,
  paginateListQueues,
  ReceiveMessageCommand,
  SQSClient,
} from '@aws-sdk/client-sqs';
import { Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class SqsService {
  private readonly client: SQSClient = new SQSClient({
    endpoint:
      this.envConfigService.getAwsEndpoint() || process.env.AWS_ENDPOINT,
    region: this.envConfigService.getAwsRegion(),
    credentials: {
      accessKeyId: this.envConfigService.getAwsAccessKeyId(),
      secretAccessKey: this.envConfigService.getAwsSecretAccessKey(),
    },
  });

  constructor(
    @Inject('IEnvironmentVariables')
    private readonly envConfigService: IEnvironmentVariables,
  ) {}

  async createQueue(queue_name: string) {
    const command = new CreateQueueCommand({
      QueueName: queue_name,
    });

    const response = await this.client.send(command);
    return response;
  }

  async deleteQueue(queue_url: string) {
    const command = new DeleteQueueCommand({
      QueueUrl: queue_url,
    });

    const response = await this.client.send(command);
    return response;
  }

  async listQueues() {
    const paginatedListQueues = paginateListQueues({ client: this.client }, {});
    const urls = [];
    for await (const page of paginatedListQueues) {
      const nextUrls = page.QueueUrls?.filter((qurl) => !!qurl) || [];
      urls.push(...nextUrls);
    }

    return urls;
  }

  @Cron('0 */3 * * * *')
  async handleFirstSqsMessage() {
    console.log(new Date().toISOString(), 'First - Checking for messages ...');

    const queueUrl = this.envConfigService.getFirstQueueUrl();
    const command = new ReceiveMessageCommand({
      MaxNumberOfMessages: 1,
      MessageAttributeNames: ['All'],
      QueueUrl: queueUrl,
      WaitTimeSeconds: 1,
      VisibilityTimeout: 1,
      AttributeNames: ['All'],
    });
    const { Messages } = await this.client.send(command);

    if (!Messages) {
      return;
    }

    for (const message of Messages) {
      const message_body = message.Body;
      console.log(message_body);

      const randon_factor = Math.floor(Math.random() * 10);
      if (randon_factor > 5) {
        console.log(
          'Message has been processd ... deleting from queue',
          message.MessageId,
        );
        await this.client.send(
          new DeleteMessageCommand({
            QueueUrl: queueUrl,
            ReceiptHandle: message.ReceiptHandle,
          }),
        );
      } else
        console.log('Message has not been processed ... coming back to queue');
    }
    //}
  }

  @Cron('0 */3 * * * *')
  async handleSeccondSqsMessage() {
    console.log(
      new Date().toISOString(),
      'Seccond - Checking for messages ...',
    );

    const queueUrl = this.envConfigService.getSeccondQueueUrl();
    const command = new ReceiveMessageCommand({
      MaxNumberOfMessages: 1,
      MessageAttributeNames: ['All'],
      QueueUrl: queueUrl,
      WaitTimeSeconds: 1,
      VisibilityTimeout: 1,
      AttributeNames: ['All'],
    });
    const { Messages } = await this.client.send(command);

    if (!Messages) {
      return;
    }

    for (const message of Messages) {
      const message_body = message.Body;
      console.log(message_body);

      const randon_factor = Math.floor(Math.random() * 10);
      if (randon_factor > 5) {
        console.log(
          'Message has been processd ... deleting from queue',
          message.MessageId,
        );
        await this.client.send(
          new DeleteMessageCommand({
            QueueUrl: queueUrl,
            ReceiptHandle: message.ReceiptHandle,
          }),
        );
      } else
        console.log('Message has not been processed ... coming back to queue');
    }
    //}
  }
}
