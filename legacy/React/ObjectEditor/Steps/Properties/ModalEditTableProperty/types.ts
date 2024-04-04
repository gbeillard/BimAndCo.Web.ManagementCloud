export type ColumnType = {
  key: number;
  guid: string;
  name: string;
  type: TypeColumn;
};

export type DataType = number | string | boolean;

// -- SchemaTable structure in back (dto)
export type SchemaTable = {
  Columns: Column[];
  Rows: ObjectValue[][];
};

export type Column = {
  Id: number;
  Guid: string;
  EntityType: EntityTypeEnum;
};

export type ObjectValue = {
  Guid: string;
  Value: string;
};

export enum EntityTypeEnum {
  Property = 0,
  ClassificationNode = 1,
}
// --

// -- Data table structure in back (dto)
export type TableJson = {
  Row: ValueJson[][];
};

export type ValueJson = {
  Guid: string;
  Value: string;
};
// --

export enum TypeColumn {
  TEXT = 'text',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
}
