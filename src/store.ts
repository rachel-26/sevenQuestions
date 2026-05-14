import { create } from 'zustand';

interface AppState {
  currentBook: string;
  currentChapter: number;
  currentVerse: number;
  setPassage: (book: string, chapter: number, verse: number) => void;
}

export const useStore = create<AppState>()((set) => ({
  currentBook: 'Genesis',
  currentChapter: 1,
  currentVerse: 1,
  setPassage: (book: string, chapter: number, verse: number) => set({ currentBook: book, currentChapter: chapter, currentVerse: verse }),
}));
