import { AsyncApiBuilder } from '../src/async-api-builder';
import { Schemas } from '../src/schema-builder';

const schemas = Schemas.create()
  .add('TestObject', s => s.object({additionalProperties: s.string({overrides: {const: 'x'}})}));

function a2s() {
  return AsyncApiBuilder.create('test', '1.0.0', schemas)
    .securityScheme('MyScheme', { type: 'http', scheme: 'someScheme' });
}

describe('Async Api Builder', () => {

  describe('Servers', () => {
    it('should build raw server', () => {
      const schema = a2s().server('Test', {
        url: 'https://localhost:8080',
        protocol: 'https'
      });
      expect(schema.schema().servers).toEqual({
        Test: {
          url: 'https://localhost:8080',
          protocol: 'https'
        }
      })
    });
  });

  describe('Channels', () => {
    it('should build raw channel', () => {
      const schema = a2s()
        .channel('testChannel', {
        publish: {
          message: {
            payload: schemas.reference('TestObject')
          }
        }
      });
      expect(schema.schema().channels).toEqual({
        testChannel: {
          publish: {
            message: {
              payload: { '$ref': '#/components/schemas/TestObject' }
            }
          }
        }
      })
    });

    it('should build with channel builder', () => {
      const asyncApi = a2s();
      const schema = asyncApi
        .server('s', {} as any)
        .channel(
          'testChannel',
          channel => channel.publish(
            operation => operation.message(
              message => message.payloadFrom('TestObject')
            )
          )
        );
      expect(schema.schema().channels).toEqual({
        testChannel: {
          publish: {
            message: {
              payload: { '$ref': '#/components/schemas/TestObject' }
            }
          }
        }
      });
    })
  });
});