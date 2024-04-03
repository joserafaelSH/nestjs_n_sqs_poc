import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { EnvConfigModule } from './config/environment/env-config/env-config.module';
import { DynamodbModule } from './dynamodb/dynamodb.module';
import { SqsModule } from './sqs/sqs.module';

@Module({
  imports: [EnvConfigModule, DynamodbModule, SqsModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
