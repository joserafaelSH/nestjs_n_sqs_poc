import { Module } from '@nestjs/common';
import { SqsService } from './sqs.service';
import { EnvConfigModule } from '@/config/environment/env-config/env-config.module';
import { EnvConfigService } from '@/config/environment/env-config/env-config.service';

@Module({
  imports: [EnvConfigModule.forRoot()],
  providers: [
    SqsService,
    {
      provide: 'IEnvironmentVariables',
      useClass: EnvConfigService,
    },
  ],
  exports: [SqsService],
})
export class SqsModule {}
