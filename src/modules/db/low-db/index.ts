import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

import { logger } from '../../../services/logger.js';
import { CustomError } from '../../../errors.js';

import type { DB, TableDataType, TableName } from './model.js';

const filePath = join(dirname(fileURLToPath(import.meta.url)), '../../../db/db.json');
const adapter = new JSONFile<DB>(filePath);
const db = new Low(adapter);

// Save to file
async function save() {
    db.write();
}

export async function init() {
    logger.info('Initializing DB.. 💾');
    await db.read();

    // logger.info(db.data);
}

export function addEntry<T extends TableName>(tableName: T, data: TableDataType<T>) {
    if (!db.data) throw new CustomError('[DB: addEntry] couldn\'t add entry. db.data is null');

    db.data[tableName] ||= [];
    (db.data[tableName] as TableDataType<T>[]).push(data);
    save();
}

export function getTable<T extends TableName>(tableName: T) {
    if (!db.data) return [];
    return db.data[tableName];
}