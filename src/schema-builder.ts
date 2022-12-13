import { JSONSchema7, JSONSchema7Definition } from 'json-schema';
import { AppendConstraint, Constraint } from './constraint';

export interface SchemaObjectProps {
  required?: Record<string, JSONSchema7Definition>;
  optional?: Record<string, JSONSchema7Definition>;
  additionalProperties?: boolean | JSONSchema7Definition;
  validation?: Pick<JSONSchema7, 'minProperties' | 'maxProperties' | 'const'>
  overrides?: JSONSchema7
}

export interface SchemaStringProps {
  validation?: Pick<JSONSchema7, 'maxLength' | 'minLength' | 'pattern' | 'enum' | 'const'>;
  overrides?: JSONSchema7;
}

export interface SchemaNumberProps {
  validation?: Pick<JSONSchema7, 'multipleOf' | 'maximum' | 'exclusiveMaximum' | 'minimum' | 'exclusiveMinimum' | 'enum' | 'const'>;
  overrides?: JSONSchema7;
}

export interface SchemaBooleanProps {
  validation?: Pick<JSONSchema7, 'const'>;
  overrides?: JSONSchema7;
}

export interface SchemaArrayProps {
  items?: JSONSchema7['items'];
  additionalItems?: JSONSchema7['additionalItems'];
  validation?: Pick<JSONSchema7,  'maxItems' | 'minItems' | 'uniqueItems' | 'contains'>;
  overrides?: JSONSchema7;
}

export class SchemaBuilder<C extends SchemaConstraints = {}> {

  private constructor(private name?: string, private location?: string) {}

  static object(properties?: SchemaObjectProps): JSONSchema7 {
    return SchemaBuilder.create().object(properties);
  }

  object(properties?: SchemaObjectProps): JSONSchema7 {
    const requiredKeys = Object.keys(properties?.required ?? {});
    const props = (properties?.required || properties?.optional) ? { ...properties.required, ...properties.optional } : undefined;
    return {
      type: 'object',
      ...(this.name ? { title: this.name } : {}),
      ...(requiredKeys.length ? { required: requiredKeys } : {}),
      ...(props ? { properties: props } : {} ),
      ...(properties?.additionalProperties ? { additionalProperties: properties.additionalProperties } : {}),
      ...properties?.validation,
      ...properties?.overrides
    }
  }

  static string(properties?: SchemaStringProps): JSONSchema7 {
    return {
      type: 'string',
      ...properties?.validation,
      ...properties?.overrides
    };
  }
  string(properties?: SchemaStringProps): JSONSchema7 {
    return SchemaBuilder.string(properties);
  }

  static number(properties?: SchemaNumberProps): JSONSchema7 {
    return {
      type: 'number',
      ...properties?.validation,
      ...properties?.overrides
    };
  }
  number(properties?: SchemaNumberProps): JSONSchema7 {
    return SchemaBuilder.number(properties);
  }

  static integer(properties?: SchemaNumberProps): JSONSchema7 {
    return {
      type: 'integer',
      ...properties?.validation,
      ...properties?.overrides
    };
  }
  integer(properties?: SchemaNumberProps): JSONSchema7 {
    return SchemaBuilder.integer(properties);
  }

  static boolean(properties?: SchemaBooleanProps): JSONSchema7 {
    return {
      type: 'boolean',
      ...properties?.validation,
      ...properties?.overrides
    };
  }
  boolean(properties?: SchemaBooleanProps): JSONSchema7 {
    return SchemaBuilder.boolean(properties);
  }

  static null(properties?: { overrides?: JSONSchema7 }): JSONSchema7 {
    return {
      type: 'null',
      ...properties?.overrides
    };
  }
  null(properties?: { overrides?: JSONSchema7 }): JSONSchema7 {
    return SchemaBuilder.null(properties);
  }

  static array(properties?: SchemaArrayProps): JSONSchema7 {
    return {
      type: 'array',
      ...(properties?.items ? { items: properties.items } : {}),
      ...(properties?.additionalItems ? { additionalItems: properties.additionalItems } : {}),
      ...properties?.validation,
      ...properties?.overrides
    };
  }
  array(properties?: SchemaArrayProps): JSONSchema7 {
    return SchemaBuilder.array(properties);
  }

  reference<S extends Constraint<C, 'schemas'>>(key: S): { '$ref': string } {
    return {'$ref': `${this.location ? `${this.location}/` : ''}${key}`};
  }

  static create(name?: string, location = '#/components/schemas'): SchemaBuilder {
    return new SchemaBuilder(name, location);
  }
}

export type SchemaConstraints = {
  schemas?: string;
}

export class Schemas<C extends SchemaConstraints = {}> {
  private constructor(private location: string, private schemas: Record<string, JSONSchema7> = {}) {
  }

  add<S extends string>(name: S, schema: JSONSchema7): Schemas<AppendConstraint<C, 'schemas', S>>;
  add<S extends string>(name: S, schema: (schema: SchemaBuilder<AppendConstraint<C, 'schemas', S>>) => JSONSchema7): Schemas<AppendConstraint<C, 'schemas', S>>;
  add<S extends string>(name: S, schema: JSONSchema7 | ((schema: SchemaBuilder<AppendConstraint<C, 'schemas', S>>) => JSONSchema7)): Schemas<AppendConstraint<C, 'schemas', S>> {
    if(typeof schema === 'object') {
      this.schemas[name] = schema;
    } else {
      this.schemas[name] = schema(SchemaBuilder.create(name, this.location));
    }
    return this as any;
  }

  reference<S extends Constraint<C, 'schemas'>>(key: S): { '$ref': string } {
    return { '$ref': `${this.location}/${key}` };
  }

  referenceUnknown<S extends string>(key: S): { '$ref': string } {
    return { '$ref': `${this.location}/${key}` };
  }

  build(): Record<Constraint<C, 'schemas'>, JSONSchema7> {
    return this.schemas;
  }

  static create(location = '#/components/schemas'): Schemas {
    return new Schemas(location);
  }
}