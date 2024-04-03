import { Injectable } from '@nestjs/common';
import { IEnvironmentVariables } from '../environment.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvConfigService implements IEnvironmentVariables {
  constructor(private readonly configService: ConfigService) {}

  getAwsEndpoint(): string {
    return this.configService.get<string>('AWS_ENDPOINT');
  }
  getAwsRegion(): string {
    return this.configService.get<string>('AWS_REGION');
  }
  getAwsAccessKeyId(): string {
    return this.configService.get<string>('AWS_ACCESS_KEY_ID');
  }
  getAwsSecretAccessKey(): string {
    return this.configService.get<string>('AWS_SECRET_ACCESS_KEY');
  }
  getNodeEnv(): string {
    return this.configService.get<string>('NODE_ENV');
  }
  getPort(): string {
    return this.configService.get<string>('PORT');
  }
}
