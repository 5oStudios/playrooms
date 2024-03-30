import type { ConfigFile } from '@rtk-query/codegen-openapi';


const config: ConfigFile = {
  schemaFile:
    'https://raw.githubusercontent.com/heroiclabs/nakama/master/apigrpc/apigrpc.swagger.json',
  apiFile: './src/store/emptyApi.ts',
  apiImport: 'emptySplitApi',
  outputFile: './src/store/petApi.ts',
  exportName: 'petApi',
  hooks: true,
};

export default config;