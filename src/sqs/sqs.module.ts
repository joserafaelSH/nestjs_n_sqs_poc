import { Module } from '@nestjs/common';
import { SqsService } from './sqs.service';
import { EnvConfigModule } from '@/config/environment/env-config/env-config.module';
import { EnvConfigService } from '@/config/environment/env-config/env-config.service';

import { ScheduleModule } from '@nestjs/schedule';
@Module({
  imports: [EnvConfigModule.forRoot(), ScheduleModule.forRoot()],
  providers: [
    SqsService,
    {
      provide: 'IEnvironmentVariables',
      useClass: EnvConfigService,
    },
  ],
  exports: [SqsService],
  controllers: [],
})
export class SqsModule {}
