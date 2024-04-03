import { Test, TestingModule } from '@nestjs/testing';
import { EnvConfigService } from '../env-config.service';
import { EnvConfigModule } from '../env-config.module';

describe('EnvConfigService', () => {
  let sut: EnvConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [EnvConfigModule.forRoot()],
      providers: [EnvConfigService],
    }).compile();

    sut = module.get<EnvConfigService>(EnvConfigService);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  describe('get environment vars ', () => {
    it('should return a node env', () => {
      const nodeEnv = sut.getNodeEnv();
      expect(nodeEnv).toBeDefined();
      expect(nodeEnv).toEqual('test');
    });

    it('should return a port', () => {
      const port = sut.getPort();
      expect(port).toBeDefined();
      expect(port).toBe('8000');
    });
  });
});
