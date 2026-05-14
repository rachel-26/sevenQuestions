import { useState, useEffect } from 'react';
import { genesis1, type Verse } from '../bibleData';

export function useBibleData(book: string, chapter: number, verse?: number) {
  const [data, setData] = useState<Verse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVerses = async () => {
      setIsLoading(true);
      setError(null);

      // Fallback for demonstration: if it's Genesis 1, use embedded data
      if (book.toLowerCase() === 'genesis' && chapter === 1) {
        if (verse) {
          setData(genesis1.filter(v => v.verse === verse));
        } else {
          setData(genesis1);
        }
        setIsLoading(false);
        return;
      }

      // Fetch from public API
      try {
        const query = verse ? `${book} ${chapter}:${verse}` : `${book} ${chapter}`;
        const response = await fetch(`https://bible-api.com/${encodeURIComponent(query)}`);
        
        if (!response.ok) throw new Error('Failed to fetch bible data');
        
        const result = await response.json();
        
        const mappedVerses: Verse[] = result.verses.map((v: any) => ({
          book_name: v.book_name,
          chapter: v.chapter,
          verse: v.verse,
          text: v.text.trim()
        }));
        
        setData(mappedVerses);
      } catch (err: any) {
        setError(err.message || 'An error occurred fetching scripture');
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVerses();
  }, [book, chapter, verse]);

  return { data, isLoading, error };
}
