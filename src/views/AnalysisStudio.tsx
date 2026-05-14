import React, { useState } from 'react';
import { useBibleData } from '../hooks/useBibleData';
import { useAnalysis } from '../hooks/useAnalysis';
import { useStore } from '../store';
import { StudioSidebar } from '../components/StudioSidebar';

export const AnalysisStudio: React.FC = () => {
  const { currentBook, currentChapter, currentVerse, setPassage } = useStore();
  const { data: verses, isLoading } = useBibleData(currentBook, currentChapter);
  const { analysis, saveAnalysis } = useAnalysis(currentBook, currentChapter, currentVerse);

  const [answers, setAnswers] = useState({
    who: [] as string[], why: '', when: '', where: [] as string[], what: [] as string[], how_many: undefined as number | undefined, how: '', actions: [] as string[], repetitions: [] as string[]
  });
  
  const generateDNA = (text: string | undefined) => {
    if (!text) return { consistency: 0, density: 0 };
    const hash = text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return {
      consistency: 70 + (hash % 28),
      density: 50 + ((hash * 7) % 45)
    };
  };
  const currentVerseText = verses.find(v => v.verse === currentVerse)?.text;
  const dna = generateDNA(currentVerseText);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  React.useEffect(() => {
    if (analysis?.answers) {
      const dbAnswers = analysis.answers as any;
      setAnswers({
        who: Array.isArray(dbAnswers.who) ? dbAnswers.who : (dbAnswers.who ? [dbAnswers.who] : []),
        why: dbAnswers.why || '',
        when: dbAnswers.when || '',
        where: Array.isArray(dbAnswers.where) ? dbAnswers.where : (dbAnswers.where ? [dbAnswers.where] : []),
        what: Array.isArray(dbAnswers.what) ? dbAnswers.what : (dbAnswers.what ? [dbAnswers.what] : []),
        how_many: dbAnswers.how_many,
        how: dbAnswers.how || '',
        actions: Array.isArray(dbAnswers.actions) ? dbAnswers.actions : (dbAnswers.actions ? [dbAnswers.actions] : []),
        repetitions: Array.isArray(dbAnswers.repetitions) ? dbAnswers.repetitions : (dbAnswers.repetitions ? [dbAnswers.repetitions] : [])
      });
    } else {
      setAnswers({ who: [], why: '', when: '', where: [], what: [], how_many: undefined, how: '', actions: [], repetitions: [] });
    }
  }, [analysis, currentVerse]);

  const handleChange = (field: keyof typeof answers, value: any) => {
    setAnswers(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckbox = (action: string) => {
    setAnswers(prev => ({
      ...prev,
      actions: prev.actions.includes(action) 
        ? prev.actions.filter(a => a !== action)
        : [...prev.actions, action]
    }));
  };

  const handleSave = () => {
    saveAnalysis(answers);
    alert('Analysis Saved!');
  };

  const handleAutoAnalyze = async () => {
    const verseText = verses.find(v => v.verse === currentVerse)?.text;
    if (!verseText) return;

    setIsAnalyzing(true);
    try {
      const response = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          book: currentBook,
          chapter: currentChapter,
          verse: currentVerse,
          text: verseText
        })
      });

      if (!response.ok) throw new Error('Analysis request failed');
      const data = await response.json();
      setAnswers({
        who: Array.isArray(data.who) ? data.who : (data.who ? [data.who] : []),
        why: data.why || '',
        when: data.when || '',
        where: Array.isArray(data.where) ? data.where : (data.where ? [data.where] : []),
        what: Array.isArray(data.what) ? data.what : (data.what ? [data.what] : []),
        how_many: data.how_many,
        how: data.how || '',
        actions: Array.isArray(data.actions) ? data.actions : (data.actions ? [data.actions] : []),
        repetitions: Array.isArray(data.repetitions) ? data.repetitions : (data.repetitions ? [data.repetitions] : [])
      });
    } catch (err) {
      console.error(err);
      alert('Failed to connect to backend. Is studio.py running?');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      <StudioSidebar />
      <main className="flex-1 flex flex-col md:flex-row h-[calc(100vh-64px)] overflow-hidden">
        {/* Center Pane: Verse Text */}
        <section className="flex-1 overflow-y-auto p-8 bg-white border-r border-border-subtle">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-primary font-label-bold text-label-bold tracking-widest uppercase">ESV VERSION</span>
                <h2 className="font-display-lg text-display-lg mt-1">{currentBook} {currentChapter}:{currentVerse}</h2>
              </div>
              <button className="text-slate-500 hover:text-slate-900 flex items-center gap-1 font-label-bold text-label-bold transition-colors">
                <span className="material-symbols-outlined text-[20px]">bookmark</span>
                Save
              </button>
            </div>

            <div className="space-y-8 mono-text leading-relaxed text-[17px] text-slate-900">
              {isLoading ? (
                <p>Loading verses...</p>
              ) : verses.map((v) => (
                <p 
                  key={v.verse} 
                  className="relative group cursor-pointer"
                  onClick={() => setPassage(currentBook, currentChapter, v.verse)}
                >
                  <span className="absolute -left-8 top-0 text-slate-400 text-sm font-mono opacity-40 group-hover:opacity-100 transition-opacity">
                    {v.verse}
                  </span>
                  {v.verse === currentVerse ? (
                    <span className="bg-amber-100 dark:bg-amber-900/30 px-1 border-b-2 border-amber-500">{v.text}</span>
                  ) : (
                    v.text
                  )}
                </p>
              ))}
            </div>

            {/* Meta Info Card */}
            <div className="mt-12 p-6 bg-background-light rounded-xl border border-border-subtle">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <span className="material-symbols-outlined text-primary">analytics</span>
                </div>
                <h3 className="font-headline-md text-headline-md">Narrative Structure DNA</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-micro-detail font-micro-detail mb-1">
                    <span>LITERARY CONSISTENCY</span>
                    <span>{dna.consistency}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-primary h-full transition-all duration-1000" style={{ width: `${dna.consistency}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-micro-detail font-micro-detail mb-1">
                    <span>SYMBOLIC DENSITY</span>
                    <span>{dna.density}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-success h-full transition-all duration-1000" style={{ width: `${dna.density}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Right Pane: 7-Question Form */}
        <section className="w-[440px] shrink-0 bg-background-light overflow-y-auto p-gutter border-l border-border-subtle">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-headline-md text-headline-md">Verse Analysis</h3>
            <span className={`px-3 py-1 rounded text-label-caps font-label-caps ${isAnalyzing ? 'bg-amber-100 text-amber-700' : 'bg-success/10 text-success'}`}>
              {isAnalyzing ? 'ANALYZING...' : 'IN PROGRESS'}
            </span>
          </div>

          <div className="space-y-4">
            {/* Question 1: Who */}
            <div className="bg-white p-5 rounded-xl border border-border-subtle shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-6 h-6 flex items-center justify-center bg-slate-900 text-white rounded-full text-[10px] font-bold">1</span>
                <span className="font-label-bold text-label-bold uppercase tracking-wider text-slate-500">Who</span>
              </div>
              <p className="text-body-sm font-body-sm text-slate-400 mb-2">Identify primary and secondary characters.</p>
              <textarea
                className="w-full bg-slate-100 border-none rounded-lg text-body-base font-body-base p-3 focus:ring-2 focus:ring-primary focus:bg-white transition-all h-20 resize-none outline-none"
                value={Array.isArray(answers.who) ? answers.who.join(', ') : (answers.who || '')}
                onChange={(e) => handleChange('who', e.target.value.split(',').map(s => s.trim()))}
              />
            </div>

            {/* Question 2: Why */}
            <div className="bg-white p-5 rounded-xl border border-border-subtle shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-6 h-6 flex items-center justify-center bg-slate-900 text-white rounded-full text-[10px] font-bold">2</span>
                <span className="font-label-bold text-label-bold uppercase tracking-wider text-slate-500">Why</span>
              </div>
              <p className="text-body-sm font-body-sm text-slate-400 mb-2">Purpose or motive behind the action.</p>
              <textarea
                className="w-full bg-slate-100 border-none rounded-lg text-body-base font-body-base p-3 focus:ring-2 focus:ring-primary focus:bg-white transition-all h-20 resize-none outline-none"
                value={answers.why}
                onChange={(e) => handleChange('why', e.target.value)}
              />
            </div>

            {/* Question 3: When */}
            <div className="bg-white p-5 rounded-xl border border-border-subtle shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-6 h-6 flex items-center justify-center bg-slate-900 text-white rounded-full text-[10px] font-bold">3</span>
                <span className="font-label-bold text-label-bold uppercase tracking-wider text-slate-500">When</span>
              </div>
              <p className="text-body-sm font-body-sm text-slate-400 mb-2">Chronology or historical context.</p>
              <textarea
                className="w-full bg-slate-100 border-none rounded-lg text-body-base font-body-base p-3 focus:ring-2 focus:ring-primary focus:bg-white transition-all h-20 resize-none outline-none"
                value={answers.when}
                onChange={(e) => handleChange('when', e.target.value)}
              />
            </div>

            {/* Question 4: Where */}
            <div className="bg-white p-5 rounded-xl border border-border-subtle shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-6 h-6 flex items-center justify-center bg-slate-900 text-white rounded-full text-[10px] font-bold">4</span>
                <span className="font-label-bold text-label-bold uppercase tracking-wider text-slate-500">Where</span>
              </div>
              <p className="text-body-sm font-body-sm text-slate-400 mb-2">Physical or metaphysical location.</p>
              <textarea
                className="w-full bg-slate-100 border-none rounded-lg text-body-base font-body-base p-3 focus:ring-2 focus:ring-primary focus:bg-white transition-all h-20 resize-none outline-none"
                value={Array.isArray(answers.where) ? answers.where.join(', ') : (answers.where || '')}
                onChange={(e) => handleChange('where', e.target.value.split(',').map(s => s.trim()))}
              />
            </div>

            {/* Question 5: What */}
            <div className="bg-white p-5 rounded-xl border border-border-subtle shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-6 h-6 flex items-center justify-center bg-slate-900 text-white rounded-full text-[10px] font-bold">5</span>
                <span className="font-label-bold text-label-bold uppercase tracking-wider text-slate-500">What</span>
              </div>
              <p className="text-body-sm font-body-sm text-slate-400 mb-2">Specific objects or choices in the text.</p>
              <textarea
                className="w-full bg-slate-100 border-none rounded-lg text-body-base font-body-base p-3 focus:ring-2 focus:ring-primary focus:bg-white transition-all h-20 resize-none outline-none"
                value={Array.isArray(answers.what) ? answers.what.join(', ') : (answers.what || '')}
                onChange={(e) => handleChange('what', e.target.value.split(',').map(s => s.trim()))}
              />
            </div>

            {/* Question 6: How Many */}
            <div className="bg-white p-5 rounded-xl border border-border-subtle shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-6 h-6 flex items-center justify-center bg-slate-900 text-white rounded-full text-[10px] font-bold">6</span>
                <span className="font-label-bold text-label-bold uppercase tracking-wider text-slate-500">How Many</span>
              </div>
              <p className="text-body-sm font-body-sm text-slate-400 mb-2">Numerical quantities mentioned.</p>
              <input
                type="number"
                className="w-full bg-slate-100 border-none rounded-lg text-body-base font-body-base p-3 focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none"
                value={answers.how_many || ''}
                onChange={(e) => handleChange('how_many', e.target.value ? parseInt(e.target.value) : undefined)}
              />
            </div>

            {/* Question 7: How */}
            <div className="bg-white p-5 rounded-xl border border-border-subtle shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-6 h-6 flex items-center justify-center bg-slate-900 text-white rounded-full text-[10px] font-bold">7</span>
                <span className="font-label-bold text-label-bold uppercase tracking-wider text-slate-500">How</span>
              </div>
              <p className="text-body-sm font-body-sm text-slate-400 mb-2">Mechanisms or modes of operation.</p>
              <textarea
                className="w-full bg-slate-100 border-none rounded-lg text-body-base font-body-base p-3 focus:ring-2 focus:ring-primary focus:bg-white transition-all h-20 resize-none outline-none"
                value={answers.how}
                onChange={(e) => handleChange('how', e.target.value)}
              />
            </div>

            {/* Repetitions */}
            <div className="bg-white p-5 rounded-xl border border-border-subtle shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-6 h-6 flex items-center justify-center bg-slate-900 text-white rounded-full text-[10px] font-bold">8</span>
                <span className="font-label-bold text-label-bold uppercase tracking-wider text-slate-500">Repetitions</span>
              </div>
              <p className="text-body-sm font-body-sm text-slate-400 mb-2">Repeated words or phrases.</p>
              <textarea
                className="w-full bg-slate-100 border-none rounded-lg text-body-base font-body-base p-3 focus:ring-2 focus:ring-primary focus:bg-white transition-all h-20 resize-none outline-none"
                value={Array.isArray(answers.repetitions) ? answers.repetitions.join(', ') : (answers.repetitions || '')}
                onChange={(e) => handleChange('repetitions', e.target.value.split(',').map(s => s.trim()))}
              />
            </div>

            {/* Actions */}
            <div className="bg-white p-5 rounded-xl border border-border-subtle shadow-sm border-l-4 border-l-success">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-6 h-6 flex items-center justify-center bg-success text-white rounded-full text-[10px] font-bold">9</span>
                <span className="font-label-bold text-label-bold uppercase tracking-wider text-success">Actions</span>
              </div>
              <p className="text-body-sm font-body-sm text-slate-400 mb-2">Practical application or follow-up steps.</p>
              <div className="space-y-2">
                {(Array.isArray(answers.actions) ? answers.actions : []).map((action, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input 
                      checked={true}
                      onChange={() => handleCheckbox(action)}
                      className="rounded text-success focus:ring-success" 
                      type="checkbox"
                    />
                    <span className="text-body-sm font-body-base">{action}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 flex gap-3 pb-8">
            <button 
              onClick={handleAutoAnalyze}
              className="flex-1 bg-white border border-border-subtle py-3 rounded-xl font-label-bold text-label-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
              disabled={isAnalyzing}
            >
              <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
              Auto Analyze
            </button>
            <button 
              onClick={handleSave} 
              className="flex-1 bg-primary text-white py-3 rounded-xl font-label-bold text-label-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20"
            >
              Save Final
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};
