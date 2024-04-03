import { EnvConfigService } from '@/config/environment/env-config/env-config.service';
import { DynamodbService } from '../dynamodb.service';
import { Test, TestingModule } from '@nestjs/testing';
import { EnvConfigModule } from '@/config/environment/env-config/env-config.module';

describe('DynamodbService', () => {
  let sut: DynamodbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [EnvConfigModule.forRoot()],
      providers: [
        {
          provide: 'IEnvironmentVariables',
          useClass: EnvConfigService,
        },
        DynamodbService,
      ],
    }).compile();

    sut = module.get<DynamodbService>(DynamodbService);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  beforeEach(async () => {
    await sut.createTable('users');
  });

  afterEach(async () => {
    await sut.deleteTable('users');
  });

  it('it should return an array with dynamodb tables', async () => {
    const response = await sut.listTables();
    const tables = response['TableNames'];
    expect(tables).toEqual(['users']);
  });
});
