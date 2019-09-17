import * as fs from 'fs';
import {
  ArrayAvroSchema,
  AvroSchema,
  EnumAvroSchema,
  JsonSchema,
  RecordAvroSchema,
  TypeAvroSchema
  } from './schema-factory';
import {
  getDefinition,
  IsArraySchema,
  IsDefinitionSchema,
  IsEnumSchema,
  IsTypeSchema
  } from './schema-checker';

export const AvroTypes = {
  number: 'double',
  string: 'string',
  boolean: 'boolean',
  array: 'array',
  enum: 'enum'
};

export const GenerateAvroSchema = (
  name: string,
  rootJsonSchema: JsonSchema
): Promise<AvroSchema> => {
  let avroSchema: AvroSchema = {
    type: 'record',
    name: name,
    fields: []
  };

  const definitions = rootJsonSchema.definitions;
  function itearateSchema(jsonSchema: JsonSchema, fields: any[] | any) {
    for (let key in jsonSchema.properties) {
      const property = jsonSchema.properties[key];
      switch (true) {
        case IsTypeSchema(property): {
          new TypeAvroSchema(jsonSchema, key, fields);
          break;
        }
        case IsEnumSchema(property): {
          new EnumAvroSchema(rootJsonSchema, key, property, fields);
          break;
        }
        case IsDefinitionSchema(property): {
          const definition: string = getDefinition(property['$ref']);
          const definitionProperty = definitions[definition];

          if (IsEnumSchema(definitionProperty)) {
            new EnumAvroSchema(rootJsonSchema, key, property, fields);
          } else {
            const recordSchema = new RecordAvroSchema(key, definition, fields);
            itearateSchema(definitionProperty, recordSchema.type.fields);
          }
          break;
        }
        case IsArraySchema(property): {
          const arraySchema = new ArrayAvroSchema(jsonSchema, key, fields);
          const items = arraySchema.type.items;
          if (items && items.fields) {
            itearateSchema(definitions[items.name], items.fields);
          }
          break;
        }
        default: {
          const type: string = AvroTypes[property.type];
          const isRequiredKey: boolean = jsonSchema.required.some(
            (req: string) => key === req
          );
          fields.push({
            name: key,
            type: isRequiredKey ? type : ['null', type]
          });
        }
      }
    }
  }

  itearateSchema(rootJsonSchema, avroSchema.fields);

  return new Promise((resolve: Function, reject: Function) => {
    try {
      fs.writeFile(
        __dirname + `/${name}.json`,
        JSON.stringify(avroSchema),
        () => {
          resolve(avroSchema);
        }
      );
    } catch (err) {
      reject(err);
    }
  });
};
