import { SchemaToTsBuilder } from '@hexlabs/json-schema-to-ts';

(() => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const builder = SchemaToTsBuilder.createWithOthers({['http://json-schema.org/draft-07/schema#']: require('./src/schema/json-schema-draft-07.json')}, require('./src/schema/async-api.json'), 'models', (name, location) => {
    if(name === 'AsyncAPI300schema') return {name: 'AsyncApi', location};
    if(name === 'Message') return {name: 'MessageType', location};
    if(name === 'MessageType_1_1') return {name: 'Message', location};
    if(name === 'MessageType_1_0') return {name: 'OneOfMessages', location};
    return {name, location};
  });
  const modelFile = builder.modelFiles();
  modelFile.write('generated');
})();