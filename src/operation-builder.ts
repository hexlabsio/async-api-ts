import {
  A2SBindingType,
  A2SHttpOperation,
  A2SMessage,
  A2SOperation,
  A2SOperationConstraints,
  A2SSnsOperation
} from './a2s';
import { build } from './builder';
import { Constraint } from './constraint';
import { MessageBuilder } from './message-builder';

export class OperationBuilder<C extends A2SOperationConstraints = {}> {

  private constructor(private operation: A2SOperation<C> = {}) {

  }

  id(operationId: string): this {
    this.operation.operationId = operationId;
    return this;
  }

  externalDocs(externalDocs: string): this {
    this.operation.externalDocs = externalDocs;
    return this;
  }

  summary(summary: string): this {
    this.operation.summary = summary;
    return this;
  }

  description(description: string): this {
    this.operation.description = description;
    return this;
  }

  security(security: Record<Constraint<C, 'securitySchemes'>, string[]>): this {
    this.operation.security = security;
    return this;
  }

  tag(name: string, description?: string, externalDocs?: string): this {
    this.operation.tags = [...(this.operation.tags ?? []), { name, description, externalDocs }];
    return this;
  }

  message(...message: Array<Constraint<C, 'messages'> | A2SMessage | ((message: MessageBuilder<C>) => MessageBuilder<C>)>): this {
    const messages = message.map(it => (typeof(it) === 'string' ? { '$ref': `#/components/messages/${it}` } : build(it, () => MessageBuilder.create())));
    if(messages.length === 1) {
      this.operation.message = messages[0];
    } else {
      this.operation.message = { oneOf: messages }
    }
    return this;
  }

  binding(type: string | A2SBindingType, operationBinding: unknown): this {
    this.operation.bindings = { ...this.operation.bindings, [type]: operationBinding };
    return this;
  }

  http(binding: A2SHttpOperation): this {
    this.operation.bindings = { ...this.operation.bindings, http: binding };
    return this;
  }

  sns(binding: A2SSnsOperation): this {
    this.operation.bindings = { ...this.operation.bindings, sns: binding };
    return this;
  }

  build(): A2SOperation {
    return this.operation;
  }

  static create<C extends A2SOperationConstraints = {}>(): OperationBuilder<C> {
    return new OperationBuilder()
  }
}