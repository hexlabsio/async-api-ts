import { JSONSchema7 } from 'json-schema';
import { Constraint } from './constraint';

export interface A2SRef {
  '$ref': string;
}

export interface A2SLicense {
  name: string;
  url: string;
}

export interface A2SContact {
  name?: string;
  url?: string;
  email?: string;
}

export type A2SProtocol = string | 'amqp' | 'amqps' | 'http' | 'https' | 'ibmmq' | 'jms' | 'kafka' | 'kafka-secure' | 'anypointmq' | 'mqtt' | 'secure-mqtt' | 'solace' | 'stomp' | 'stomps' | 'ws' | 'wss' | 'mercure' | 'googlepubsub'

export type A2SBindingType = 'http' | 'ws' | 'kafka' | 'anypointmq' | 'amqp' | 'amqp1' | 'mqtt' | 'mqtt5' | 'nats' | 'jms' | 'sns' | 'solace' | 'sqs' | 'stomp' | 'redis' | 'mercure' | 'ibmmq' | 'googlepubsub'

export interface A2SServerVariable {
  enum?: string[];
  default?: string;
  description?: string;
  examples?: string[];
}

export interface A2STag {
  name: string;
  description?: string;
  externalDocs?: string;
}

export interface A2SServer {
  url: string;
  protocol: A2SProtocol;
  protocolVersion?: string;
  description?: string;
  variables?: Record<string, A2SServerVariable | A2SRef>;
  security?: Record<string, string[]>;
  tags?: A2STag[];
  bindings?: Record<A2SProtocol, A2SServerBindings> | A2SRef;
}

export type A2SHttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS' | 'CONNECT' | 'TRACE';

export interface A2SHttpOperation {
  type: 'request' | 'response';
  method?: A2SHttpMethod;
  query?: JSONSchema7 & { type: 'object', properties: any };
  bindingVersion?: string;
}

export interface A2SHttpMessage {
  headers?: JSONSchema7 & { type: 'object', properties: any };
  bindingVersion?: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface A2SSnsMessage {
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface A2SSnsOperation {
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface A2SServerBindings {
}


// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface A2SChannelBindings {
}

export interface A2SOperationBindings {
  http: A2SHttpOperation;
  sns: A2SSnsOperation;
}

export interface A2SMessageBindings {
  http: A2SHttpMessage;
  sns: A2SSnsMessage;
}

export interface A2SCorrelationId {
  description?: string;
  location: string;
}

export interface A2SMessageExample {
  headers?: Record<string, any>;
  payload?: any;
  name?: string;
  summary?: string;
}

export type A2SMessageConstraints = {
  schemas?: string;
  correlationIds?: string;
}

export interface A2SMessage<C extends A2SMessageConstraints = {}> {
  messageId?: string;
  payload?: JSONSchema7 | { '$ref': `#/components/schemas/${Constraint<C, 'schemas'>}`};
  headers?: (JSONSchema7 & { type: 'object', properties: any }) | A2SRef;
  correlationId?: A2SCorrelationId | { '$ref': `#/components/correlationIds/${Constraint<C, 'correlationIds'>}`};
  schemaFormat?: string;
  contentType?: string;
  name?: string;
  title?: string;
  summary?: string;
  description?: string;
  tags?: A2STag[];
  externalDocs?: string;
  bindings?: A2SMessageBindings | Record<A2SBindingType | string, any> | A2SRef;
  examples?: A2SMessageExample[];
  traits?: Array<Omit<A2SMessage<C>, 'traits'> | A2SRef>;
}

export type A2SOperationConstraints = Pick<A2SComponentsConstraints, 'securitySchemes'> & A2SMessageConstraints;

export interface A2SOperation<C extends A2SOperationConstraints = {}> {
  operationId?: string;
  summary?: string;
  description?: string;
  security?: Record<Constraint<C, 'securitySchemes'>, string[]>;
  tags?: A2STag[];
  externalDocs?: string;
  bindings?: A2SOperationBindings | Record<A2SBindingType | string, any> | A2SRef;
  traits?: Array<Omit<A2SOperation, 'traits' | 'message'> | A2SRef>;
  message?: A2SMessage | A2SRef | { oneOf: Array<A2SMessage | A2SRef> };
}

export interface A2SParameter {
  description?: string;
  location?: string;
  schema?: JSONSchema7 | A2SRef
}


export type ChannelConstraints = Pick<A2SComponentsConstraints, 'servers'> & A2SOperationConstraints;

export interface A2SChannelItem<C extends ChannelConstraints = {}> {
  description?: string;
  servers?: Constraint<C, 'servers'>[];
  subscribe?: A2SOperation;
  publish?: A2SOperation;
  parameters?: Record<string, A2SParameter | A2SRef>;
  bindings?: A2SChannelBindings | Record<A2SBindingType | string, any> | A2SRef;
}

export interface A2SInfo {
  title: string;
  version: string;
  description?: string;
  termsOfService?: string;
  contact?: A2SContact;
  license?: A2SLicense;
}

export type A2SComponentsConstraints = {
  schemas?: string;
  servers?: string;
  serverVariables?: string;
  channels?: string;
  messages?: string;
  securitySchemes?: string;
  parameters?: string;
  correlationIds?: string;
  operationTraits?: string;
  messageTraits?: string;
  serverBindings?: string;
  channelBindings?: string;
  operationBindings?: string;
  messageBindings?: string;
}

export interface A2SOAuthFlow {
  authorizationUrl?: string;
  tokenUrl?: string;
  refreshUrl?: string;
  scopes: Record<string, string>;
}

export interface A2SOAuthFlows {
  implicit?: A2SOAuthFlow;
  password?: A2SOAuthFlow;
  clientCredentials?: A2SOAuthFlow;
  authorizationCode?: A2SOAuthFlow;
}

export type A2SSecuritySchemes = 'userPassword' | 'apiKey' | 'X509' | 'symmetricEncryption' | 'asymmetricEncryption' | 'httpApiKey' | 'http' | 'oauth2' | 'openIdConnect' | 'plain' | 'scramSha256' | 'scramSha512' | 'gssapi';

export type A2SSecurityScheme = { type: 'httpApiKey'; description?: string; name: string; in: 'query' | 'header' | 'cookie' }
  | { type: 'apiKey', description?: string; in: 'user' | 'password' }
  | { type: 'http'; description?: string; scheme: string; bearerFormat?: string }
  | { type: 'oauth2'; description?: string; flows: A2SOAuthFlows }
  | { type: 'openIdConnect'; description?: string; openIdConnectUrl: string; }
  | { type: Exclude<A2SSecuritySchemes, 'httpApiKey' | 'apiKey' | 'http' | 'oauth2' | 'openIdConnect'> }

export interface A2SComponents<C extends A2SComponentsConstraints = {}> {
  schemas?: Record<Constraint<C, 'schemas'>, JSONSchema7 | A2SRef>
  servers?: Record<Constraint<C, 'servers'>, A2SServer | A2SRef>;
  serverVariables?: Record<Constraint<C, 'serverVariables'>, A2SServerVariable | A2SRef>;
  channels?: Record<Constraint<C, 'channels'>, A2SChannelItem>;
  messages?: Record<Constraint<C, 'messages'>, A2SMessage | A2SRef>;
  securitySchemes?: Record<Constraint<C, 'securitySchemes'>, A2SSecurityScheme | A2SRef>;
  parameters?: Record<Constraint<C, 'parameters'>, A2SParameter | A2SRef>;
  correlationIds?: Record<Constraint<C, 'correlationIds'>, A2SCorrelationId | A2SRef>;
  operationTraits?: Record<Constraint<C, 'operationTraits'>, Omit<A2SOperation, 'traits' | 'message'> | A2SRef>;
  messageTraits?: Record<Constraint<C, 'messageTraits'>, Omit<A2SMessage, 'traits'> | A2SRef>;
  serverBindings?: Record<Constraint<C, 'serverBindings'>, A2SServer['bindings']>;
  channelBindings?: Record<Constraint<C, 'channelBindings'>, A2SChannelItem['bindings']>;
  operationBindings?: Record<Constraint<C, 'operationBindings'>, A2SOperation['bindings']>;
  messageBindings?: Record<Constraint<C, 'messageBindings'>, A2SMessage['bindings']>;
}

export interface A2S<C extends A2SComponentsConstraints = {}>{
  asyncApi: `${number}.${number}.${number}`;
  id?: string;
  info: A2SInfo;
  servers?: Record<string, A2SServer | A2SRef>;
  defaultContentType?: string;
  channels: Record<string, A2SChannelItem<C>>
  components?: A2SComponents<C>;
  tags?: A2STag[];
  externalDocs?: string;
}