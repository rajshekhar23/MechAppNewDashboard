import { ServicemasterModule } from './servicemaster.module';

describe('ServicemasterModule', () => {
  let servicemasterModule: ServicemasterModule;

  beforeEach(() => {
    servicemasterModule = new ServicemasterModule();
  });

  it('should create an instance', () => {
    expect(servicemasterModule).toBeTruthy();
  });
});
