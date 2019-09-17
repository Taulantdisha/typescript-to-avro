import { getDefinition } from './schema-checker';

export interface JsonSchema {
  type: string;
  properties: any[];
  required: string[];
  definitions: any[];
}

export interface AvroSchema {
  type: string | string[];
  name: string;
  symbols?: string[];
  fields?: AvroSchema[];
  items?: AvroSchema;
}

export class BaseAvroSchema {
  name: string;
  doc?: string;
  default?: string;
}

export class TypeAvroSchema extends BaseAvroSchema {
  public type: string;

  constructor(
    private _schema: JsonSchema,
    private _key: string,
    private fields: any[]
  ) {
    super();
    this.name = this._key;
    this.type = this._schema.properties[this._key].enum[0];
    this.fields.push(this.construct());
  }

  public construct(): any {
    return {
      name: this.name,
      type: this.type
    };
  }
}

export class EnumAvroSchema extends BaseAvroSchema {
  public type = {
    type: 'enum',
    name: '',
    symbols: []
  };

  constructor(
    private _schema: JsonSchema,
    private _key: string,
    private _property: any,
    private fields: any[]
  ) {
    super();

    const definition: string = getDefinition(this._property['$ref']);

    this.name = this._key;
    this.type.name = definition;
    this.type.symbols = this._schema.definitions[definition].enum;
    this.fields.push(this.construct());
  }

  public construct(): any {
    return {
      name: this.name,
      type: this.type
    };
  }
}

export class RecordAvroSchema extends BaseAvroSchema {
  public type = {
    type: 'record',
    name: '',
    fields: []
  };

  constructor(
    private key: string,
    private definition: string,
    private fields: any[]
  ) {
    super();

    this.name = this.key;
    this.type.name = this.definition;
    this.fields.push(this.construct());
  }

  public construct(): any {
    return {
      name: this.name,
      type: this.type
    };
  }
}

export class ArrayAvroSchema extends BaseAvroSchema {
  public type = {
    type: 'array'
  } as any;

  constructor(
    private _schema: JsonSchema,
    private key: string,
    private fields: any[]
  ) {
    super();

    this.name = this.key;
    const arraySchema: { $ref: string } = this._schema.properties[key].items;
    if (arraySchema.$ref) {
      const definition: string = getDefinition(arraySchema.$ref);
      this.type = {
        ...this.type,
        items: {
          type: 'record',
          name: definition,
          fields: []
        }
      };
    } else {
      this.type.items = {
        type: 'array',
        items: ''
      };
    }
    this.fields.push(this.construct());
  }

  public construct(): any {
    return {
      name: this.name,
      type: this.type
    };
  }
}
