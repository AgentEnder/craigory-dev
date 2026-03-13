import { ServiceManager } from 'ace-linters/build/service-manager';

const manager = new ServiceManager(self as unknown as Worker);

manager.registerService('typescript', {
  modes: 'typescript|ts|tsx',
  className: 'TypescriptService',
  module: () => import('ace-linters/build/typescript-service'),
});
