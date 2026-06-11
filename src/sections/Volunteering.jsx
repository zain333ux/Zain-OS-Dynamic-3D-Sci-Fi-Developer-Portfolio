import React from 'react';
import Card from '../components/ui/Card';
import Reveal from '../components/ui/Reveal';
import CodeBackdrop from '../components/ui/CodeBackdrop';
import { volunteering } from '../data/volunteering';
import { ExternalLink } from 'lucide-react';

const Volunteering = () => {
  return (
    <section id="volunteering" className="section-pad relative overflow-hidden border-t border-cardBorder">
      <CodeBackdrop type="volunteering" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        <Reveal>
          <h2 className="font-heading text-3xl font-bold text-textPrimary tracking-wide">// Volunteering</h2>
          <p className="text-xs text-textMuted font-mono mt-1 uppercase">// SOCIAL RESPONSIBILITY &amp; ENGAGEMENT</p>
        </Reveal>

        <div className="max-w-4xl">
          <Reveal delay={0.1}>
            <Card className="p-0 overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                {/* Content Area */}
                <div className="md:col-span-2 p-6 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-lg font-bold text-textPrimary">{volunteering.role}</h3>
                      <p className="text-xs font-mono text-accentCyan mt-1">{volunteering.organization}</p>
                    </div>
                    <p className="text-sm text-textMuted leading-relaxed">
                      {volunteering.description}
                    </p>
                  </div>
                  
                  <div className="pt-2">
                    <a 
                      href="/VolunteeringAppreciationCertificate.png" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-[10px] font-mono text-accentPurple hover:text-accentCyan transition-colors duration-200 select-none cursor-pointer uppercase tracking-wider border border-accentPurple/30 px-3 py-1.5 rounded-sm bg-accentPurple/5 hover:bg-accentCyan/5 hover:border-accentCyan/30"
                    >
                      <span>[ View Full Certificate ]</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
                
                {/* Certificate Preview Thumbnail */}
                <div className="md:col-span-1 p-6 md:p-4 bg-white/5 border-t md:border-t-0 md:border-l border-cardBorder/30 flex flex-col items-center justify-center min-h-[180px]">
                  <a 
                    href="/VolunteeringAppreciationCertificate.png" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="relative group w-full h-full flex items-center justify-center overflow-hidden rounded border border-cardBorder hover:border-accentCyan/40 transition-colors duration-300 shadow-lg bg-bgDark"
                  >
                    <img 
                      src="/VolunteeringAppreciationCertificate.png" 
                      alt="Al-Khidmat Volunteering Appreciation Certificate" 
                      className="w-full h-auto max-h-[140px] object-contain transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-bgDark/80 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all duration-300 space-y-2 pointer-events-none select-none">
                      <ExternalLink className="w-5 h-5 text-accentCyan animate-pulse" />
                      <span className="text-[9px] font-mono text-textPrimary tracking-widest uppercase">// OPEN PREVIEW</span>
                    </div>
                  </a>
                </div>
              </div>
            </Card>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default Volunteering;
