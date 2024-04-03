import { IEnvironmentVariables } from '@/config/environment/environment.interface';
import {
  CreateQueueCommand,
  DeleteQueueCommand,
  paginateListQueues,
  SQSClient,
} from '@aws-sdk/client-sqs';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class SqsService {
  private readonly client: SQSClient = new SQSClient({
    endpoint: this.envConfigService.getAwsEndpoint(),
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
}
