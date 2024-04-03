import { IEnvironmentVariables } from '@/config/environment/environment.interface';
import {
  CreateTableCommand,
  DeleteTableCommand,
  DynamoDBClient,
  ListTablesCommand,
} from '@aws-sdk/client-dynamodb';
import { DeleteCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class DynamodbService {
  private readonly client: DynamoDBClient = new DynamoDBClient({
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

  async createTable(table_name: string) {
    const command = new CreateTableCommand({
      TableName: table_name,
      AttributeDefinitions: [
        {
          AttributeName: 'ID',
          AttributeType: 'S',
        },
      ],
      KeySchema: [
        {
          AttributeName: 'ID',
          KeyType: 'HASH',
        },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      },
    });

    const response = await this.client.send(command);
    return response;
  }

  async deleteTable(table_name: string) {
    const command = new DeleteTableCommand({
      TableName: table_name,
    });

    const response = await this.client.send(command);
    return response;
  }

  async createItem(table_name: string, item: any) {
    const command = new PutCommand({
      TableName: table_name,
      Item: {
        id: crypto.randomUUID(),
        ...item,
      },
    });
    const response = await this.client.send(command);
    return response.Attributes;
  }

  async deleteItem(table_name: string, id: string) {
    const command = new DeleteCommand({
      TableName: table_name,
      Key: {
        id: id,
      },
    });

    const response = await this.client.send(command);
    return response;
  }

  async listTables() {
    const command = new ListTablesCommand({});

    const response = await this.client.send(command);

    return response;
  }
}
