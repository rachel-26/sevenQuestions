import Dexie, { type EntityTable } from 'dexie';

export interface Analysis {
  id?: number;
  book: string;
  chapter: number;
  verse: number;
  answers: {
    who: string[];
    why: string;
    when: string;
    where: string[];
    what: string[];
    how_many?: number;
    how: string;
    actions: string[];
    repetitions: string[];
  };
  updated_at: string;
  tags: string[];
}

export const db = new Dexie('ScriptureOS') as Dexie & {
  analyses: EntityTable<Analysis, 'id'>;
};

db.version(1).stores({
  analyses: '++id, [book+chapter+verse], updated_at',
});
