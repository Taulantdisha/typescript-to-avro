export function getDefinition(definitionRef: string): string {
  let words = definitionRef.split('/');
  return words[words.length - 1];
}

export const IsTypeSchema = (property: {
  type: string;
  enum: string[];
}): boolean => {
  return (
    property.type === 'string' && property.enum && property.enum.length === 1
  );
};

export const IsEnumSchema = (property: {
  type: string;
  enum: string[];
  $ref: string;
}): boolean => {
  return (
    property.type === 'string' && property.enum && property.enum.length > 1
  );
};

export const IsArraySchema = (property: {
  type: string;
  items: string;
}): boolean => {
  return property.type === 'array' && !!property.items;
};

export const IsDefinitionSchema = (property: {
  type: string;
  $ref: string[];
}): boolean => {
  return !!property.$ref;
};
