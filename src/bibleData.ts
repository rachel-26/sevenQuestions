export interface Verse {
  book_name: string;
  chapter: number;
  verse: number;
  text: string;
}

export const genesis1: Verse[] = [
  { book_name: "Genesis", chapter: 1, verse: 1, text: "In the beginning God created the heavens and the earth." },
  { book_name: "Genesis", chapter: 1, verse: 2, text: "The earth was without form, and void; and darkness was on the face of the deep. And the Spirit of God was hovering over the face of the waters." },
  { book_name: "Genesis", chapter: 1, verse: 3, text: "Then God said, \"Let there be light\"; and there was light." }
];

export interface BookCategory {
  category: string;
  books: { name: string; chapters: number }[];
}

export const bibleStructure: BookCategory[] = [
  {
    category: "PENTATEUCH",
    books: [
      { name: "Genesis", chapters: 50 },
      { name: "Exodus", chapters: 40 },
      { name: "Leviticus", chapters: 27 },
      { name: "Numbers", chapters: 36 },
      { name: "Deuteronomy", chapters: 34 }
    ]
  },
  {
    category: "HISTORY (OT)",
    books: [
      { name: "Joshua", chapters: 24 }, { name: "Judges", chapters: 21 }, { name: "Ruth", chapters: 4 },
      { name: "1 Samuel", chapters: 31 }, { name: "2 Samuel", chapters: 24 }, { name: "1 Kings", chapters: 22 },
      { name: "2 Kings", chapters: 25 }, { name: "1 Chronicles", chapters: 29 }, { name: "2 Chronicles", chapters: 36 },
      { name: "Ezra", chapters: 10 }, { name: "Nehemiah", chapters: 13 }, { name: "Esther", chapters: 10 }
    ]
  },
  {
    category: "POETRY & WISDOM",
    books: [
      { name: "Job", chapters: 42 }, { name: "Psalms", chapters: 150 }, { name: "Proverbs", chapters: 31 },
      { name: "Ecclesiastes", chapters: 12 }, { name: "Song of Solomon", chapters: 8 }
    ]
  },
  {
    category: "PROPHETS",
    books: [
      { name: "Isaiah", chapters: 66 }, { name: "Jeremiah", chapters: 52 }, { name: "Lamentations", chapters: 5 },
      { name: "Ezekiel", chapters: 48 }, { name: "Daniel", chapters: 12 }, { name: "Hosea", chapters: 14 },
      { name: "Joel", chapters: 3 }, { name: "Amos", chapters: 9 }, { name: "Obadiah", chapters: 1 },
      { name: "Jonah", chapters: 4 }, { name: "Micah", chapters: 7 }, { name: "Nahum", chapters: 3 },
      { name: "Habakkuk", chapters: 3 }, { name: "Zephaniah", chapters: 3 }, { name: "Haggai", chapters: 2 },
      { name: "Zechariah", chapters: 14 }, { name: "Malachi", chapters: 4 }
    ]
  },
  {
    category: "GOSPELS",
    books: [
      { name: "Matthew", chapters: 28 }, { name: "Mark", chapters: 16 }, { name: "Luke", chapters: 24 }, { name: "John", chapters: 21 }
    ]
  },
  {
    category: "HISTORY (NT)",
    books: [
      { name: "Acts", chapters: 28 }
    ]
  },
  {
    category: "EPISTLES",
    books: [
      { name: "Romans", chapters: 16 }, { name: "1 Corinthians", chapters: 16 }, { name: "2 Corinthians", chapters: 13 },
      { name: "Galatians", chapters: 6 }, { name: "Ephesians", chapters: 6 }, { name: "Philippians", chapters: 4 },
      { name: "Colossians", chapters: 4 }, { name: "1 Thessalonians", chapters: 5 }, { name: "2 Thessalonians", chapters: 3 },
      { name: "1 Timothy", chapters: 6 }, { name: "2 Timothy", chapters: 4 }, { name: "Titus", chapters: 3 },
      { name: "Philemon", chapters: 1 }, { name: "Hebrews", chapters: 13 }, { name: "James", chapters: 5 },
      { name: "1 Peter", chapters: 5 }, { name: "2 Peter", chapters: 3 }, { name: "1 John", chapters: 5 },
      { name: "2 John", chapters: 1 }, { name: "3 John", chapters: 1 }, { name: "Jude", chapters: 1 }
    ]
  },
  {
    category: "PROPHECY (NT)",
    books: [
      { name: "Revelation", chapters: 22 }
    ]
  }
];

export const getChaptersForBook = (bookName: string): number => {
  for (const cat of bibleStructure) {
    const book = cat.books.find(b => b.name === bookName);
    if (book) return book.chapters;
  }
  return 1;
};
