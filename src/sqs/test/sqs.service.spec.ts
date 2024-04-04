import { EnvConfigService } from '@/config/environment/env-config/env-config.service';
import { SqsService } from '../sqs.service';
import { Test, TestingModule } from '@nestjs/testing';
import { EnvConfigModule } from '@/config/environment/env-config/env-config.module';

describe('SqsService', () => {
  let sut: SqsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [EnvConfigModule.forRoot()],
      providers: [
        {
          provide: 'IEnvironmentVariables',
          useClass: EnvConfigService,
        },
        SqsService,
      ],
    }).compile();

    sut = module.get<SqsService>(SqsService);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  beforeEach(async () => {
    await sut.createQueue('users');
  });

  afterEach(async () => {
    await sut.deleteQueue(
      'http://sqs.us-east-1.localhost.localstack.cloud:4566/000000000000/users',
    );
  });

  it('it should return an array with sqs queues', async () => {
    const response = await sut.listQueues();
    expect(response).toContain([
      'http://sqs.us-east-1.localhost.localstack.cloud:4566/000000000000/users',
    ]);
  });
});
