'use client';

import React from 'react';
import { SiteSettings, ProcessStep } from '@/lib/db';
import { ArrowRight } from 'lucide-react';

interface ProcessSectionProps {
  settings: SiteSettings;
}

const DEFAULT_STEPS: ProcessStep[] = [
  {
    id: 'step-1',
    stepNumber: '01',
    stepLabel: 'FİKİR',
    description: 'Sizin konseptiniz, bizim yaratıcılığımız.',
    imageUrl: '/images/process_01.jpg'
  },
  {
    id: 'step-2',
    stepNumber: '02',
    stepLabel: 'TASARIM',
    description: 'Detaylı kalıplar ve tasarım çizimleri.',
    imageUrl: '/images/process_02.jpg'
  },
  {
    id: 'step-3',
    stepNumber: '03',
    stepLabel: 'PROTOTİP',
    description: 'Mükemmel doku ve form için numune testi.',
    imageUrl: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'step-4',
    stepNumber: '04',
    stepLabel: 'ÜRETİM',
    description: 'Markanız ve sevdikleriniz için hazır.',
    imageUrl: '/images/hero_hedgehog.jpg'
  }
];

export default function ProcessSection({ settings }: ProcessSectionProps) {
  const kicker = settings.processKicker || 'ÜRETİM SÜRECİMİZ';
  const title = settings.processTitle || 'Çizimden gülümsemeye.';
  const description =
    settings.processSubtitle ||
    'Fikirlerinizi yaratıcı tasarım, yüksek kaliteli malzemeler ve güvenilir bir üretim süreciyle hayata geçiriyoruz.';
  const ctaText = settings.processCtaText || 'SÜRECİMİZİ KEŞFEDİN →';
  const steps = settings.processSteps && settings.processSteps.length > 0 ? settings.processSteps : DEFAULT_STEPS;

  return (
    <section
      id="process"
      style={{ backgroundColor: 'var(--process-bg)' }}
      className="py-20 sm:py-28 border-t border-current/10 relative transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Main Grid: Left Narrative + Right 4 Process Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Heading and Description */}
          <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-32">
            <span
              style={{ color: 'var(--text-muted)' }}
              className="text-[11px] sm:text-xs font-bold tracking-[0.25em] uppercase block"
            >
              {kicker}
            </span>

            <h2
              style={{ color: 'var(--text-main)' }}
              className="text-3xl sm:text-4xl lg:text-[42px] font-medium tracking-[-0.02em] leading-[1.14]"
            >
              {title}
            </h2>

            <p
              style={{ color: 'var(--text-muted)' }}
              className="text-xs sm:text-sm leading-relaxed max-w-md font-normal"
            >
              {description}
            </p>

            <div className="pt-2">
              <a
                href="#contact"
                style={{
                  color: 'var(--text-main)',
                  borderColor: 'var(--text-main)',
                }}
                className="group inline-flex items-center gap-2 text-xs font-bold tracking-[0.15em] uppercase border-b pb-1 transition-all"
              >
                <span>{ctaText.replace('→', '').trim()}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>

          {/* Right Column: 4 Sequential Steps */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-4">
              {steps.map((step, index) => (
                <div
                  key={step.id || index}
                  style={{ backgroundColor: 'var(--card-bg)' }}
                  className="rounded-2xl sm:rounded-3xl p-3 sm:p-3.5 border border-current/10 shadow-sm hover:shadow-md transition-all flex flex-col group"
                >
                  {/* Step Image */}
                  <div className="w-full aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-current/5 mb-3.5 relative">
                    <img
                      src={step.imageUrl || '/images/hero_hedgehog.jpg'}
                      alt={`${step.stepNumber} ${step.stepLabel}`}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Step Text Info */}
                  <div className="space-y-1 px-1 pb-1">
                    <h3
                      style={{ color: 'var(--text-main)' }}
                      className="text-xs font-extrabold tracking-wider uppercase"
                    >
                      {step.stepNumber} — {step.stepLabel}
                    </h3>
                    <p
                      style={{ color: 'var(--text-muted)' }}
                      className="text-[11px] leading-relaxed font-normal"
                    >
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
