import React, { useState } from 'react';
import { bibleStructure, getChaptersForBook } from '../bibleData';
import { useStore } from '../store';

export const StudioSidebar: React.FC = () => {
  const { currentBook, currentChapter, setPassage } = useStore();
  const [search, setSearch] = useState("");
  const currentBookChapters = getChaptersForBook(currentBook);

  const filteredStructure = bibleStructure.map(cat => ({
    ...cat,
    books: cat.books.filter(b => b.name.toLowerCase().includes(search.toLowerCase()))
  })).filter(cat => cat.books.length > 0);

  return (
    <aside className="bg-white dark:bg-background-dark border-r border-border-subtle dark:border-slate-800 w-64 flex flex-col shrink-0 h-full overflow-y-auto">
      <div className="p-4 space-y-4">
        <div className="relative">
          <input 
            className="w-full bg-background-light border-none rounded-lg py-2 pl-10 text-body-sm font-body-sm focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none" 
            placeholder="Quick Verse Search" 
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="material-symbols-outlined absolute left-3 top-2 text-slate-400">search</span>
        </div>
        
        {/* Books List */}
        <div className="space-y-4">
          {filteredStructure.map(cat => (
            <div key={cat.category} className="space-y-1">
              <p className="text-slate-500 font-label-caps text-label-caps px-2 mb-2">{cat.category}</p>
              {cat.books.map(book => (
                <div 
                  key={book.name}
                  onClick={() => setPassage(book.name, 1, 1)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all ${currentBook === book.name ? 'bg-background-light dark:bg-slate-900 text-slate-900 dark:text-white font-label-bold text-label-bold' : 'text-slate-500 dark:text-slate-400 font-body-base text-body-base hover:bg-background-light'}`}
                >
                  <span className="material-symbols-outlined text-[18px]">{currentBook === book.name ? 'menu_book' : 'book'}</span>
                  <span>{book.name}</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Chapters Grid */}
        <div className="space-y-1 mt-6 border-t border-border-subtle pt-4">
          <p className="text-slate-500 font-label-caps text-label-caps px-2 mb-2">CHAPTERS ({currentBook.toUpperCase()})</p>
          <div className="grid grid-cols-5 gap-2 px-2">
            {Array.from({ length: currentBookChapters }).map((_, i) => {
              const ch = i + 1;
              const isActive = currentChapter === ch;
              return (
                <div 
                  key={ch}
                  onClick={() => setPassage(currentBook, ch, 1)}
                  className={`w-8 h-8 flex items-center justify-center rounded font-label-bold text-label-bold cursor-pointer transition-all ${isActive ? 'bg-primary text-white' : 'border border-border-subtle hover:bg-background-light'}`}
                >
                  {ch}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      <div className="mt-auto p-4 border-t border-border-subtle">
        <div className="flex items-center gap-3 px-3 py-2 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer">
          <span className="material-symbols-outlined">settings</span>
          <span className="font-label-bold text-label-bold">Settings</span>
        </div>
        <div className="flex items-center gap-3 px-3 py-2 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer">
          <span className="material-symbols-outlined">contact_support</span>
          <span className="font-label-bold text-label-bold">Support</span>
        </div>
      </div>
    </aside>
  );
};
