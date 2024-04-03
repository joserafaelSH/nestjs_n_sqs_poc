import { Module } from '@nestjs/common';
import { DynamodbService } from './dynamodb.service';
import { EnvConfigModule } from '@/config/environment/env-config/env-config.module';
import { EnvConfigService } from '@/config/environment/env-config/env-config.service';

@Module({
  imports: [EnvConfigModule.forRoot()],
  providers: [
    DynamodbService,
    {
      provide: 'IEnvironmentVariables',
      useClass: EnvConfigService,
    },
  ],
  exports: [DynamodbService],
})
export class DynamodbModule {}
