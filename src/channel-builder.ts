import { A2SChannelItem, A2SOperation, ChannelConstraints } from './a2s';
import { build } from './builder';
import { Constraint } from './constraint';
import { OperationBuilder } from './operation-builder';


export class ChannelBuilder<C extends ChannelConstraints = {}> {

  private constructor(private channel: A2SChannelItem<C> = {}) {}

  subscribe(operation: A2SOperation<C>): this
  subscribe(operation: (operation: OperationBuilder<C>) => OperationBuilder<C>): this
  subscribe(operation: A2SOperation<C> | ((operation: OperationBuilder<C>) => OperationBuilder<C>)): this {
    this.channel.subscribe = build(operation, () => OperationBuilder.create());
    return this;
  }

  publish(operation: A2SOperation<C>): this
  publish(operation: (operation: OperationBuilder<C>) => OperationBuilder<C>): this
  publish(operation: A2SOperation<C> | ((operation: OperationBuilder<C>) => OperationBuilder<C>)): this {
    this.channel.publish = build(operation, () => OperationBuilder.create());
    return this;
  }

  description(description: string): this {
    this.channel.description = description;
    return this;
  }

  servers(...servers: Constraint<C, 'servers'>[]): this {
    this.channel.servers = servers;
    return this;
  }

  build(): A2SChannelItem<C> {
    return this.channel;
  }

  static create<C extends ChannelConstraints = {}>(): ChannelBuilder<C> {
    return new ChannelBuilder();
  }
}