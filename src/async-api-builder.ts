import { JSONSchema7 } from 'json-schema';
import {
  A2S,
  A2SChannelItem,
  A2SComponentsConstraints,
  A2SMessage,
  A2SSecurityScheme,
  A2SServer,
  A2SServerVariable
} from './a2s';
import { build } from './builder';
import { ChannelBuilder } from './channel-builder';
import { AppendConstraint } from './constraint';
import { MessageBuilder } from './message-builder';
import { SchemaBuilder, SchemaConstraints, Schemas } from './schema-builder';

export class AsyncApiBuilder<C extends A2SComponentsConstraints = {}> {

  private constructor(private a2s: A2S) {
  }

  asyncApiSchema(): A2S {
    return this.a2s;
  }

  withSchemas<R>(builder: (s: SchemaBuilder<C>) => R): R {
    return builder(SchemaBuilder.create());
  }

  securityScheme<S extends string>(name: S, securityScheme: A2SSecurityScheme): AsyncApiBuilder<AppendConstraint<C, 'securitySchemes', S>> {
    this.a2s.components = {
      ...this.a2s.components, securitySchemes: {
        ...this.a2s.components?.securitySchemes,
        [name]: securityScheme
      }
    };
    return this as any;
  }

  server<S extends string>(name: S, server: A2SServer): AsyncApiBuilder<AppendConstraint<C, 'servers', S>> {
    this.a2s.servers = { ...this.a2s.servers, [name]:server };
    return this as any;
  }

  channel(name: string, channel: (builder: ChannelBuilder<C>) => ChannelBuilder<C>): this
  channel(name: string, channel: A2SChannelItem): this
  channel(name: string, channel: A2SChannelItem | ((builder: ChannelBuilder<C>) => ChannelBuilder<C>)): this {
    this.a2s.channels = {...this.a2s.channels, [name]: build(channel, () => ChannelBuilder.create())}
    return this;
  }

  sharedChannel<S extends string>(name: S, channel: (builder: ChannelBuilder<C>) => ChannelBuilder<C>): AsyncApiBuilder<AppendConstraint<C, 'channels', S>>
  sharedChannel<S extends string>(name: S, channel: A2SChannelItem): AsyncApiBuilder<AppendConstraint<C, 'channels', S>>
  sharedChannel<S extends string>(name: S, channel: A2SChannelItem | ((builder: ChannelBuilder<C>) => ChannelBuilder<C>)): AsyncApiBuilder<AppendConstraint<C, 'channels', S>> {
    this.a2s.components = {
      ...this.a2s.components, channels: {
        ...this.a2s.components?.channels,
        [name]: build(channel, () => ChannelBuilder.create())
      }
    };
    return this as any;
  }

  sharedMessage<S extends string>(name: S, channel: (builder: MessageBuilder<C>) => MessageBuilder<C>): AsyncApiBuilder<AppendConstraint<C, 'messages', S>>
  sharedMessage<S extends string>(name: S, channel: A2SMessage): AsyncApiBuilder<AppendConstraint<C, 'messages', S>>
  sharedMessage<S extends string>(name: S, channel: A2SMessage | ((builder: MessageBuilder<C>) => MessageBuilder<C>)): AsyncApiBuilder<AppendConstraint<C, 'messages', S>> {
    this.a2s.components = {
      ...this.a2s.components, messages: {
        ...this.a2s.components?.messages,
        [name]: build(channel, () => MessageBuilder.create())
      }
    };
    return this as any;
  }

  parameter<S extends string>(name: S, description?: string, location?: string, schema?: JSONSchema7): AsyncApiBuilder<AppendConstraint<C, 'parameters', S>> {
    this.a2s.components = {
      ...this.a2s.components, parameters: {
        ...this.a2s.components?.parameters,
        [name]: { description, location, schema }
      }
    };
    return this as any;
  }

  schema<S extends string>(name: S, schema: JSONSchema7): AsyncApiBuilder<AppendConstraint<C, 'schemas', S>>;
  schema<S extends string>(name: S, schema: ((schema: SchemaBuilder<C>) => JSONSchema7)): AsyncApiBuilder<AppendConstraint<C, 'schemas', S>>;
  schema<S extends string>(name: S, schema: JSONSchema7 | ((schema: SchemaBuilder<C>) => JSONSchema7)): AsyncApiBuilder<AppendConstraint<C, 'schemas', S>> {
    this.a2s.components = {
      ...this.a2s.components, schemas: {
        ...this.a2s.components?.schemas,
        [name]: (typeof schema === 'function' ? schema(SchemaBuilder.create(name)) : schema)
      }
    };
    return this as any;
  }

  serverVariable<S extends string>(name: S, serverVariable: A2SServerVariable): AsyncApiBuilder<AppendConstraint<C, 'serverVariables', S>> {
    this.a2s.components = {
      ...this.a2s.components, serverVariables: {
        ...this.a2s.components?.serverVariables,
        [name]: serverVariable
      }
    };
    return this as any;
  }


  static create<S extends SchemaConstraints = {}>(title: string, version: string, schemas?: Schemas<S>): AsyncApiBuilder<S> {
    return new AsyncApiBuilder({ asyncApi: '2.5.0', info: { title, version }, channels: {}, ...(schemas ? { components: { schemas: schemas?.build() } } : {}) });
  }
}