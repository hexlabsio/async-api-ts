import { A2S, A2SChannelItem, A2SComponentsConstraints, A2SSecurityScheme, A2SServer } from './a2s';
import { build } from './builder';
import { ChannelBuilder } from './channel-builder';
import { AppendConstraint } from './constraint';
import { SchemaBuilder, SchemaConstraints, Schemas } from './schema-builder';

export class AsyncApiBuilder<C extends A2SComponentsConstraints = {}> {

  private constructor(private a2s: A2S) {
  }

  schema(): A2S {
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

  static create<S extends SchemaConstraints = {}>(title: string, version: string, schemas?: Schemas<S>): AsyncApiBuilder<S> {
    return new AsyncApiBuilder({ asyncApi: '2.5.0', info: { title, version }, channels: {}, ...(schemas ? { components: { schemas: schemas?.build() } } : {}) });
  }
}