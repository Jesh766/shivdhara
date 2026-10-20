import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Wind, Volume2, VolumeX, Play, Pause, ArrowRight } from 'lucide-react';

interface MeditationScrollSectionProps {
  onNavigate: (path: string) => void;
  onOpenConsultation: () => void;
}

export const MeditationScrollSection: React.FC<MeditationScrollSectionProps> = ({
  onNavigate,
  onOpenConsultation,
}) => {
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [secondsLeft, setSecondsLeft] = useState(4);
  const [isActive, setIsActive] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);

  const playSingingBowlTone = () => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(432, ctx.currentTime); // 432Hz harmonic tone
      osc.frequency.exponentialRampToValueAtTime(216, ctx.currentTime + 3.5);

      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 3.5);
    } catch (e) {
      console.log('Web Audio tone init', e);
    }
  };

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          if (phase === 'Inhale') {
            setPhase('Hold');
            return 4;
          } else if (phase === 'Hold') {
            setPhase('Exhale');
            playSingingBowlTone();
            return 6;
          } else {
            setPhase('Inhale');
            playSingingBowlTone();
            return 4;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, phase, soundEnabled]);

  const circleScale = phase === 'Inhale' ? 1.25 : phase === 'Hold' ? 1.25 : 0.85;

  return (
    <section
      id="meditation-scroll-section"
      className="py-36 bg-[#F7F1E6] text-[#241E1A] relative overflow-hidden transition-colors-editorial border-t border-[#E6D5B8]"
    >
      {/* Soft Ambient Light Center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-[radial-gradient(circle,_rgba(230,213,184,0.35)_0%,_rgba(49,92,82,0.04)_50%,_transparent_70%)] blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-14">
        {/* Section Header */}
        <div className="space-y-4 max-w-2xl mx-auto">
          <span className="type-label-subtle text-[#315C52] block">
            CONSCIOUS PRANAYAMA SANCTUARY
          </span>

          <h2 className="type-display-xl text-[#163A36]">
            Return to <span className="type-italic-accent text-[#C56A45]">Stillness.</span>
          </h2>

          <p className="type-body-editorial text-[#4A423C] mx-auto">
            When external demands accelerate, conscious breath restores nervous system equilibrium. Experience the 4-4-6 grounding rhythm below.
          </p>
        </div>

        {/* Interactive Breathing Rhythm Visualizer */}
        <div className="flex flex-col items-center justify-center py-4">
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
            {/* Outer Pulsing Rings */}
            <motion.div
              animate={{ scale: circleScale }}
              transition={{
                duration: phase === 'Inhale' ? 4 : phase === 'Hold' ? 0.3 : 6,
                ease: 'easeInOut',
              }}
              className="absolute inset-0 rounded-full border border-[#315C52]/30 bg-[radial-gradient(circle,_rgba(49,92,82,0.06)_0%,_transparent_70%)]"
            />

            <motion.div
              animate={{ scale: circleScale * 0.85 }}
              transition={{
                duration: phase === 'Inhale' ? 4 : phase === 'Hold' ? 0.3 : 6,
                ease: 'easeInOut',
              }}
              className="absolute w-44 h-44 sm:w-56 sm:h-56 rounded-full border border-[#C56A45]/40 bg-[#F7F1E6] shadow-xl flex flex-col items-center justify-center p-4 backdrop-blur-sm"
            >
              <span className="type-label-subtle text-[#C56A45]">
                {phase}
              </span>
              <span className="type-numeral-card text-[#163A36] my-1">
                {secondsLeft}s
              </span>
              <span className="type-label-subtle text-[#4A423C]/70">
                4-4-6 RHYTHM
              </span>
            </motion.div>
          </div>

          {/* Audio & Pause Controls */}
          <div className="flex items-center gap-3 mt-10">
            <button
              onClick={() => setIsActive(!isActive)}
              className="px-4 py-2 rounded-full bg-[#FAF6EF] border border-[#E6D5B8] text-xs font-semibold text-[#163A36] hover:border-[#315C52] flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              {isActive ? <Pause className="w-3.5 h-3.5 text-[#C56A45]" /> : <Play className="w-3.5 h-3.5 text-[#C56A45]" />}
              <span>{isActive ? 'Pause Rhythm' : 'Resume Rhythm'}</span>
            </button>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`px-4 py-2 rounded-full border text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
                soundEnabled
                  ? 'bg-[#163A36] text-[#F7F1E6] border-[#163A36]'
                  : 'bg-[#FAF6EF] text-[#163A36] border-[#E6D5B8] hover:border-[#315C52]'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-[#D49A52]" /> : <VolumeX className="w-3.5 h-3.5 text-[#4A423C]/60" />}
              <span>{soundEnabled ? '432Hz Sound Active' : 'Enable 432Hz Tone'}</span>
            </button>
          </div>
        </div>

        {/* Sanctuary CTAs */}
        <div className="pt-8 border-t border-[#E6D5B8] flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => onNavigate('/meditation')}
            className="btn-primary-terracotta"
          >
            <span>Open Meditation Sanctuary</span>
            <ArrowRight className="w-4 h-4 text-[#F7F1E6]" />
          </button>

          <button
            onClick={onOpenConsultation}
            className="btn-secondary-teal"
          >
            Book 1-on-1 Breathwork Session
          </button>
        </div>
      </div>
    </section>
  );
};
