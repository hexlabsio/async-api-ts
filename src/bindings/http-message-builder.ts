import { JSONSchema7Definition } from 'json-schema';
import { A2SHttpMessage, A2SSnsMessage } from '../a2s';

export class HttpMessageBuilder {

  private constructor(private message: A2SHttpMessage = {}) {
  }

  bindingVersion(version: string): this {
    this.message.bindingVersion = version;
    return this;
  }

  headers(headers: { [key: string]: JSONSchema7Definition; }): this {
    this.message.headers = { type: 'object', properties: headers };
    return this;
  }

  build(): A2SSnsMessage {
    return this.message
  }

  static create(): HttpMessageBuilder {
    return new HttpMessageBuilder();
  }
}