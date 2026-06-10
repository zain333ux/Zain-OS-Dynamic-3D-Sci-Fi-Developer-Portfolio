import React from 'react';
import Card from '../components/ui/Card';
import Reveal from '../components/ui/Reveal';
import CodeBackdrop from '../components/ui/CodeBackdrop';
import { achievements } from '../data/achievements';

const Achievements = () => {
  return (
    <section className="section-pad relative overflow-hidden border-t border-cardBorder">
      <CodeBackdrop type="achievements" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        <Reveal>
          <h2 className="font-heading text-3xl font-bold text-textPrimary tracking-wide">// Key Milestones</h2>
          <p className="text-xs text-textMuted font-mono mt-1 uppercase">// PRACTICAL SYSTEM HIGHLIGHTS &amp; PROJECT EXPERIENCES</p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {achievements.map((ach, idx) => (
            <Reveal key={ach.id} delay={idx * 0.05} className="h-full">
              <Card className="space-y-3 flex flex-col justify-between h-full">
                <div className="space-y-2">
                  <div className="font-mono text-xs text-accentCyan">[{ach.code}]</div>
                  <h3 className="text-base font-bold text-textPrimary">{ach.title}</h3>
                  <p className="text-xs text-textMuted leading-relaxed">
                    {ach.description}
                  </p>
                </div>
                <div className="text-[9px] font-mono text-textMuted/45 uppercase tracking-wider select-none">// COMPLETED VERIFIED</div>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Achievements;
