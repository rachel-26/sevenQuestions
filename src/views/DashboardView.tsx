import React from 'react';

export const DashboardView: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto p-8">
      {/* Top Row: Stats & Quick Resume */}
      <div className="grid grid-cols-12 gap-8 mb-8">
        {/* Quick Resume Card */}
        <div className="col-span-12 lg:col-span-8 bg-white rounded-xl border border-border-subtle shadow-sm p-6 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors"></div>
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="bg-primary/10 text-primary px-2 py-1 rounded text-label-caps font-label-caps">LAST READ</span>
              <span className="text-slate-400 font-micro-detail">2 hours ago</span>
            </div>
            <h2 className="font-headline-md text-headline-md text-slate-900 mb-2">Romans 12:2</h2>
            <p className="font-body-base text-slate-500 italic max-w-2xl">
              "Do not be conformed to this world, but be transformed by the renewal of your mind..."
            </p>
          </div>
          <div className="mt-6 flex items-center space-x-4">
            <button className="bg-primary text-white font-label-bold px-6 py-2 rounded flex items-center space-x-2 shadow-sm hover:opacity-90 transition-all">
              <span className="material-symbols-outlined text-[18px]">play_arrow</span>
              <span>Continue Reading</span>
            </button>
            <button className="border border-border-subtle text-slate-900 font-label-bold px-6 py-2 rounded hover:bg-background-light transition-all">
              Open Studio
            </button>
          </div>
        </div>

        {/* Streak & Daily Goal */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          <div className="bg-white rounded-xl border border-border-subtle shadow-sm p-6 flex items-center justify-between">
            <div>
              <p className="font-label-caps text-slate-500 mb-1">CURRENT STREAK</p>
              <div className="flex items-baseline space-x-1">
                <span className="text-[36px] font-black text-amber-500">14</span>
                <span className="font-label-bold text-slate-400">DAYS</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-amber-500 text-[28px]">local_fire_department</span>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-border-subtle shadow-sm p-6">
            <p className="font-label-caps text-slate-500 mb-4">DAILY PROGRESS</p>
            <div className="flex justify-between items-end mb-2">
              <span className="font-headline-md text-slate-900">85%</span>
              <span className="font-micro-detail text-slate-400">17/20 Verses</span>
            </div>
            <div className="w-full h-[6px] bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-success rounded-full" style={{ width: '85%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Row: Heatmap & DNA Metrics */}
      <div className="grid grid-cols-12 gap-8 mb-8">
        <div className="col-span-12 lg:col-span-8 bg-white rounded-xl border border-border-subtle shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-headline-md text-slate-900">Scripture Coverage</h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-sm bg-slate-100"></div>
                <span className="font-micro-detail text-slate-400">Unread</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-sm bg-primary/40"></div>
                <span className="font-micro-detail text-slate-400">Partial</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-sm bg-primary"></div>
                <span className="font-micro-detail text-slate-400">Complete</span>
              </div>
            </div>
          </div>
          {/* Mock Heatmap */}
          <div className="grid grid-cols-12 sm:grid-cols-24 gap-1.5">
            {Array.from({ length: 48 }).map((_, i) => (
              <div key={i} className={`w-full aspect-square rounded-sm ${Math.random() > 0.5 ? 'bg-primary' : (Math.random() > 0.5 ? 'bg-primary/40' : 'bg-slate-100')}`}></div>
            ))}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 bg-white rounded-xl border border-border-subtle shadow-sm p-6">
          <h3 className="font-headline-md text-slate-900 mb-6">Literary DNA</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-label-bold text-slate-900">Theological Depth</span>
                <span className="font-label-bold text-primary">92%</span>
              </div>
              <div className="w-full h-[4px] bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>
            {/* More metrics... */}
          </div>
        </div>
      </div>
    </div>
  );
};
