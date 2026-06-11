import React from 'react';
import Card from '../components/ui/Card';
import Reveal from '../components/ui/Reveal';
import CodeBackdrop from '../components/ui/CodeBackdrop';

const Learning = () => {
  return (
    <section id="learning" className="section-pad relative overflow-hidden border-t border-cardBorder">
      <CodeBackdrop type="learning" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        <Reveal>
          <h2 className="font-heading text-3xl font-bold text-textPrimary tracking-wide">// Future Direction &amp; Focus</h2>
          <p className="text-xs text-textMuted font-mono mt-1 uppercase">// CURRENTLY STUDYING &amp; EXPANDING SKILLSETS</p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Reveal delay={0.05} className="h-full">
            <Card className="space-y-3 flex flex-col justify-between h-full">
              <div className="space-y-2">
                <h3 className="font-mono text-xs font-bold text-accentCyan uppercase tracking-widest">// Generative AI &amp; RAG</h3>
                <p className="text-sm text-textMuted leading-relaxed">
                  Understanding Large Language Models, prompt formatting parameters, context window limitations, and vector database lookups (semantic search) to retrieve custom information.
                </p>
              </div>
              <div className="text-[10px] font-mono text-accentPurple select-none">// STUDYING ARCHITECTURES</div>
            </Card>
          </Reveal>

          <Reveal delay={0.1} className="h-full">
            <Card className="space-y-3 flex flex-col justify-between h-full">
              <div className="space-y-2">
                <h3 className="font-mono text-xs font-bold text-accentCyan uppercase tracking-widest">// AI Chatbots &amp; Automation</h3>
                <p className="text-sm text-textMuted leading-relaxed">
                  Exploring autonomous agent loops, tool call capabilities, system scripting, API orchestrations, and creating simple automation scripts to streamline repetitive processes.
                </p>
              </div>
              <div className="text-[10px] font-mono text-accentPurple select-none">// EXPERIMENTING WITH APIS</div>
            </Card>
          </Reveal>

          <Reveal delay={0.15} className="h-full">
            <Card className="space-y-3 flex flex-col justify-between h-full">
              <div className="space-y-2">
                <h3 className="font-mono text-xs font-bold text-accentCyan uppercase tracking-widest">// Full-Stack Web &amp; Apps</h3>
                <p className="text-sm text-textMuted leading-relaxed">
                  Learning responsive frontend frameworks, database schemas, secure user authorization logic, and building clean web application concepts that incorporate AI workflows.
                </p>
              </div>
              <div className="text-[10px] font-mono text-accentPurple select-none">// COMPILING CODEBASES</div>
            </Card>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default Learning;
