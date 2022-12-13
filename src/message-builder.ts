import { JSONSchema7, JSONSchema7Definition } from 'json-schema';
import {
  A2SBindingType, A2SHttpMessage,
  A2SMessage, A2SMessageConstraints, A2SMessageExample, A2SSnsMessage,
} from './a2s';
import { HttpMessageBuilder } from './bindings/http-message-builder';
import { SnsMessageBuilder } from './bindings/sns-message-builder';
import { build } from './builder';
import { Constraint } from './constraint';

export class MessageBuilder<C extends A2SMessageConstraints = {}> {

  private update(name: string, binding: any, create: () => any): this {
    this.message.bindings = { ...this.message.bindings, [name]: build(binding, create) };
    return this;
  }

  private constructor(private message: A2SMessage<C> = {}) {
    this.bindings = {
      http: binding => this.update('http', binding, () => HttpMessageBuilder.create()),
      sns: binding => this.update('sns', binding, () => SnsMessageBuilder.create()),
    }
  }

  bindings: {
    http(httpMessage: A2SHttpMessage): MessageBuilder<C>;
    http(httpMessage: (httpMessage: HttpMessageBuilder) => HttpMessageBuilder): MessageBuilder<C>;
    http(httpMessage: A2SHttpMessage | ((httpMessage: HttpMessageBuilder) => HttpMessageBuilder)): MessageBuilder<C>;

    sns(snsMessage: A2SSnsMessage): MessageBuilder<C>;
    sns(snsMessage: (snsMessage: SnsMessageBuilder) => SnsMessageBuilder): MessageBuilder<C>;
    sns(snsMessage: A2SSnsMessage | ((snsMessage: SnsMessageBuilder) => SnsMessageBuilder)): MessageBuilder<C>;
  }

  headers(headers: { [key: string]: JSONSchema7Definition }): this {
    this.message.headers = { type: 'object', properties: headers };
    return this;
  }

  messageId(messageId: string): this {
    this.message.messageId = messageId;
    return this;
  }

  payloadFrom(reference: Constraint<C, 'schemas'>): this {
    this.message.payload = { '$ref': `#/components/schemas/${reference}` };
    return this;
  }

  payload(payload: JSONSchema7): this {
    this.message.payload = payload;
    return this;
  }

  anyPayload(payload: any): this {
    this.message.payload = payload;
    return this;
  }

  correlationIdFrom(reference: Constraint<C, 'correlationIds'>): this {
    this.message.payload = { '$ref': `#/components/correlationIds/${reference}` };
    return this;
  }

  schemaFormat(schemaFormat: string): this {
    this.message.schemaFormat = schemaFormat;
    return this;
  }

  contentType(contentType: string): this {
    this.message.contentType = contentType;
    return this;
  }

  name(name: string): this {
    this.message.name = name;
    return this;
  }

  title(title: string): this {
    this.message.title = title;
    return this;
  }

  summary(summary: string): this {
    this.message.summary = summary;
    return this;
  }

  description(description: string): this {
    this.message.description = description;
    return this;
  }

  externalDocs(externalDocs: string): this {
    this.message.externalDocs = externalDocs;
    return this;
  }

  tag(name: string, description?: string, externalDocs?: string): this {
    this.message.tags = [...(this.message.tags ?? []), { name, description, externalDocs }];
    return this;
  }

  examples(...examples: A2SMessageExample[]): this {
    this.message.examples = examples;
    return this;
  }

  binding(type: string | A2SBindingType, messageBinding: unknown): this {
    this.message.bindings = { ...this.message.bindings, [type]: messageBinding };
    return this;
  }

  build(): A2SMessage {
    return this.message;
  }

  static create<C extends A2SMessageConstraints = {}>(): MessageBuilder<C> {
    return new MessageBuilder()
  }
}