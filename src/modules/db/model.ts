export interface TestEntry {
    id: string;
    tokenName: string;
}

export interface DB {
    entries: TestEntry[];
}

export type TableName = keyof DB;
export type TableDataType<T> =
    T extends 'entries' ? TestEntry :
    never;
