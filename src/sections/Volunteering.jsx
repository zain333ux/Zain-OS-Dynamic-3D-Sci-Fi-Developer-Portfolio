import React from 'react';
import Card from '../components/ui/Card';
import Reveal from '../components/ui/Reveal';
import CodeBackdrop from '../components/ui/CodeBackdrop';
import { volunteering } from '../data/volunteering';

const Volunteering = () => {
  return (
    <section className="section-pad relative overflow-hidden border-t border-cardBorder">
      <CodeBackdrop type="volunteering" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        <Reveal>
          <h2 className="font-heading text-3xl font-bold text-textPrimary tracking-wide">// Volunteering</h2>
          <p className="text-xs text-textMuted font-mono mt-1 uppercase">// SOCIAL RESPONSIBILITY &amp; ENGAGEMENT</p>
        </Reveal>

        <div className="max-w-4xl">
          <Reveal delay={0.1}>
            <Card className="space-y-3">
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div>
                  <h3 className="text-lg font-bold text-textPrimary">{volunteering.role}</h3>
                  <p className="text-xs font-mono text-accentCyan mt-1">{volunteering.organization}</p>
                </div>
              </div>
              <p className="text-sm text-textMuted leading-relaxed">
                {volunteering.description}
              </p>
            </Card>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default Volunteering;
