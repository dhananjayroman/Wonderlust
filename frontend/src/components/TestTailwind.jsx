import React from 'react';

const TestTailwind = () => {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-12">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">Tailwind Test Component</h1>
        <p className="text-muted">If you can see proper styling, Tailwind is working.</p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Theme Colors</h2>
        <div className="flex gap-4 flex-wrap">
          <div className="w-24 h-24 rounded-xl2 bg-primary text-white flex items-center justify-center font-bold shadow-card">Primary</div>
          <div className="w-24 h-24 rounded-xl2 bg-secondary text-white flex items-center justify-center font-bold shadow-card">Secondary</div>
          <div className="w-24 h-24 rounded-xl2 bg-background border border-border text-gray-800 flex items-center justify-center font-bold shadow-card">Background</div>
          <div className="w-24 h-24 rounded-xl2 bg-muted text-white flex items-center justify-center font-bold shadow-card">Muted</div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Typography</h2>
        <div className="space-y-2">
          <h1 className="text-5xl font-bold">Heading 1</h1>
          <h2 className="text-4xl font-bold">Heading 2</h2>
          <h3 className="text-3xl font-semibold">Heading 3</h3>
          <p className="text-base text-gray-700">Regular paragraph text with Inter font.</p>
          <p className="text-sm text-muted">Muted small text.</p>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Animations</h2>
        <div className="flex gap-4">
          <div className="p-6 bg-white shadow-card rounded-xl3 animate-fade-in">
            Fade In Box
          </div>
          <div className="p-6 bg-white shadow-card rounded-xl3 animate-slide-up">
            Slide Up Box
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestTailwind;
