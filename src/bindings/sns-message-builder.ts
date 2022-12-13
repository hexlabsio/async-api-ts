import { A2SSnsMessage } from '../a2s';

export class SnsMessageBuilder {

  private constructor(private message: A2SSnsMessage = {}) {
  }

  build(): A2SSnsMessage {
    return this.message
  }

  static create(): SnsMessageBuilder {
    return new SnsMessageBuilder();
  }
}