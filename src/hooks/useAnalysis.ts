import { useLiveQuery } from 'dexie-react-hooks';
import { db, type Analysis } from '../db';

export function useAnalysis(book: string, chapter: number, verse: number) {
  // Fetch existing analysis for the verse if it exists
  const analysis = useLiveQuery(
    () => db.analyses.where({ book, chapter, verse }).first(),
    [book, chapter, verse]
  );

  const saveAnalysis = async (answers: Analysis['answers'], tags: string[] = []) => {
    try {
      if (analysis?.id) {
        // Update existing
        await db.analyses.update(analysis.id, {
          answers,
          updated_at: new Date().toISOString(),
          tags
        });
      } else {
        // Create new
        await db.analyses.add({
          book,
          chapter,
          verse,
          answers,
          updated_at: new Date().toISOString(),
          tags
        });
      }
    } catch (error) {
      console.error('Failed to save analysis:', error);
    }
  };

  const deleteAnalysis = async () => {
    if (analysis?.id) {
      await db.analyses.delete(analysis.id);
    }
  };

  return {
    analysis,
    saveAnalysis,
    deleteAnalysis
  };
}

export function useAllAnalyses() {
  const analyses = useLiveQuery(() => db.analyses.toArray());
  return analyses;
}
