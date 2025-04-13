export interface TableSchemaItem {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
}

export type TableSchema = TableSchemaItem[];
