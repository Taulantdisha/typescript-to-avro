import * as TJS from 'typescript-json-schema';
import { AvroSchema, JsonSchema } from './schema-factory';
import { GenerateAvroSchema } from './utils';
import { resolve } from 'path';

const settings: TJS.PartialArgs = {
  required: true
};

const compilerOptions: TJS.CompilerOptions = {
  baseUrl: '.',
  strictNullChecks: true,
  paths: {
    '*': ['typings/globals.d.ts']
  }
};

const program = TJS.getProgramFromFiles(
  [resolve('test.ts')],
  compilerOptions,
  './'
);

const NAME = 'Student';
const schema: JsonSchema = TJS.generateSchema(program, NAME, settings) as any;

const generator = TJS.buildGenerator(program, settings);

generator.getSchemaForSymbol(NAME);

GenerateAvroSchema(NAME, schema).then((value: AvroSchema) => {});
