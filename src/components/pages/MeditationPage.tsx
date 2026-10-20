import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wind, Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, ArrowRight, ShieldCheck, Heart, Moon } from 'lucide-react';

interface MeditationPageProps {
  onOpenConsultation: () => void;
  onNavigate: (path: string) => void;
}

export const MeditationPage: React.FC<MeditationPageProps> = ({
  onOpenConsultation,
  onNavigate,
}) => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'INHALE' | 'HOLD' | 'EXHALE'>('INHALE');
  const [counter, setCounter] = useState(4);
  const [cycle, setCycle] = useState(1);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [baseFreq, setBaseFreq] = useState<number>(432);

  // Web Audio Synth for singing bowl chime
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playSingingBowlChime = (freq = baseFreq) => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          audioCtxRef.current = new AudioContextClass();
        }
      }
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 3);
    } catch (e) {
      console.warn('Audio chime skipped', e);
    }
  };

  useEffect(() => {
    let timer: any;
    if (isActive) {
      timer = setInterval(() => {
        setCounter(prev => {
          if (prev <= 1) {
            // Transition phase
            if (phase === 'INHALE') {
              setPhase('HOLD');
              playSingingBowlChime(baseFreq * 1.25);
              return 4; // 4 sec hold
            } else if (phase === 'HOLD') {
              setPhase('EXHALE');
              playSingingBowlChime(baseFreq * 0.9);
              return 6; // 6 sec exhale
            } else {
              setPhase('INHALE');
              setCycle(c => c + 1);
              playSingingBowlChime(baseFreq);
              return 4; // 4 sec inhale
            }
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isActive, phase, soundEnabled, baseFreq]);

  const handleToggle = () => {
    if (!isActive) {
      playSingingBowlChime(baseFreq);
    }
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setPhase('INHALE');
    setCounter(4);
    setCycle(1);
  };

  const practices = [
    {
      title: 'Prana Dharana (Breath Anchor)',
      duration: '15 Minutes Daily',
      desc: 'Observing the natural cool touch of the in-breath and warm out-breath at the nostrils to calm sympathetic arousal and settle mental chatter.',
    },
    {
      title: 'Om & Shiva Nada Vibration',
      duration: '20 Minutes Daily',
      desc: 'Resonant vocal toning that stimulates the vagus nerve, releasing chronic cognitive tension and inviting deep emotional coherence.',
    },
    {
      title: 'Trataka (Inner Flame Contemplation)',
      duration: '10 Minutes Evening',
      desc: 'Gentle steady gazing on a ghee lamp or inner point of light to purify the optical nerves and deepen unshakeable concentration.',
    },
    {
      title: 'Antar Mouna (Inner Stillness)',
      duration: '20 Minutes Morning',
      desc: 'The ancient practice of non-judgmental witnessing of sensory stimuli, thoughts, and underlying cosmic awareness.',
    },
  ];

  return (
    <div id="page-meditation" className="min-h-screen bg-[#101827] text-[#F7F3EA] pt-24 pb-20">
      {/* Header */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 text-center space-y-4 max-w-4xl mx-auto relative">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#182236] border border-[#C8A45D]/40 text-[#DFC38A] text-xs font-bold uppercase tracking-widest">
          <Wind className="w-3.5 h-3.5 text-[#C8A45D]" />
          <span>Shiv Dhara Sanctuary</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-serif text-[#F7F3EA] font-light">
          Inner Stillness & Mindful Breath
        </h1>
        <p className="text-sm sm:text-base text-[#D9D2C3]/80 max-w-2xl mx-auto leading-relaxed font-sans">
          When the breath is still, the mind rests in its natural clarity. Experience guided diaphragmatic rhythm, sonic meditation, and personal contemplation.
        </p>
      </section>

      {/* Interactive Breath Engine Container */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="rounded-3xl bg-gradient-to-b from-[#182236]/90 to-[#101827] border border-[#C8A45D]/40 p-8 sm:p-12 shadow-2xl relative overflow-hidden text-center flex flex-col items-center">
          {/* Subtle cosmic glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(200,164,93,0.08)_0%,transparent_70%)] pointer-events-none" />

          {/* Sound toggle & Cycle Info */}
          <div className="w-full flex items-center justify-between text-xs text-[#D9D2C3]/70 pb-6 border-b border-white/10 z-10">
            <span className="font-mono uppercase tracking-widest text-[#DFC38A]">
              Cycle {cycle} of 10
            </span>
            <div className="flex items-center gap-3">
              {/* Frequency Selector */}
              <div className="flex items-center gap-1 bg-[#101827] p-1 rounded-lg border border-white/10 text-[10px]">
                {[
                  { freq: 432, label: '432Hz Om' },
                  { freq: 528, label: '528Hz Solfeggio' },
                  { freq: 396, label: '396Hz Root' },
                ].map(item => (
                  <button
                    key={item.freq}
                    onClick={() => {
                      setBaseFreq(item.freq);
                      playSingingBowlChime(item.freq);
                    }}
                    className={`px-2 py-0.5 rounded font-semibold transition-colors cursor-pointer ${
                      baseFreq === item.freq
                        ? 'bg-[#C8A45D] text-[#101827]'
                        : 'text-[#D9D2C3]/70 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="flex items-center gap-1.5 hover:text-[#C8A45D] transition-colors cursor-pointer"
                title="Toggle Singing Bowl Chime"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-[#C8A45D]" /> : <VolumeX className="w-4 h-4 text-gray-500" />}
                <span className="text-[11px] hidden sm:inline">{soundEnabled ? 'Chime ON' : 'Muted'}</span>
              </button>
            </div>
          </div>

          {/* Breathing Visual Sphere */}
          <div className="my-10 relative flex items-center justify-center w-64 h-64 sm:w-72 sm:h-72">
            {/* Outer pulsating ring */}
            <motion.div
              animate={{
                scale: phase === 'INHALE' ? 1.3 : phase === 'HOLD' ? 1.3 : 0.9,
                opacity: phase === 'HOLD' ? 0.8 : 0.4,
              }}
              transition={{
                duration: phase === 'INHALE' ? 4 : phase === 'HOLD' ? 0.1 : 6,
                ease: phase === 'INHALE' ? 'easeOut' : 'easeInOut',
              }}
              className="absolute inset-0 rounded-full border border-[#C8A45D]/40 border-dashed"
            />

            {/* Middle glowing sphere */}
            <motion.div
              animate={{
                scale: phase === 'INHALE' ? 1.15 : phase === 'HOLD' ? 1.15 : 0.75,
              }}
              transition={{
                duration: phase === 'INHALE' ? 4 : phase === 'HOLD' ? 0.1 : 6,
                ease: 'easeInOut',
              }}
              className="w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-gradient-to-tr from-[#C8A45D]/20 via-[#3D6B82]/30 to-[#C8A45D]/30 backdrop-blur-md border border-[#C8A45D]/60 flex flex-col items-center justify-center shadow-[0_0_50px_rgba(200,164,93,0.2)]"
            >
              <span className="text-3xl sm:text-4xl font-serif font-bold text-[#F7F3EA] tracking-tight">
                {counter}s
              </span>
              <span className="text-xs uppercase tracking-[0.2em] font-sans font-bold text-[#DFC38A] mt-1">
                {phase === 'INHALE' ? 'Inhale Prana' : phase === 'HOLD' ? 'Hold Still' : 'Exhale & Relax'}
              </span>
            </motion.div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4 z-10">
            <button
              onClick={handleToggle}
              className="px-8 py-3.5 rounded-full bg-[#C8A45D] text-[#101827] text-xs font-bold tracking-[0.2em] uppercase hover:brightness-110 flex items-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isActive ? 'Pause Sanctuary' : 'Begin 4-4-6 Rhythm'}</span>
            </button>

            <button
              onClick={handleReset}
              className="p-3 rounded-full bg-white/10 text-[#D9D2C3] hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
              title="Reset Breath Cycle"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-[#D9D2C3]/60 max-w-sm mt-6 font-sans">
            Inhale deeply through your nose for 4 seconds, retain gently for 4 seconds, and exhale slowly through mouth for 6 seconds.
          </p>
        </div>
      </section>

      {/* Interactive 108 Japa Bead Counter Section */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <JapaMalaCounter playChime={playSingingBowlChime} />
      </section>

      {/* 4 Pillars of Meditation */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-16 space-y-10">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase tracking-[0.25em] font-sans font-bold text-[#C8A45D] block">
            Core Disciplines
          </span>
          <h2 className="text-3xl font-serif text-[#F7F3EA] font-light">
            The Four Foundations of Inner Awareness
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {practices.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[#182236]/80 border border-white/10 space-y-3 hover:border-[#C8A45D]/40 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#DFC38A]">
                  {item.duration}
                </span>
                <Sparkles className="w-4 h-4 text-[#C8A45D]" />
              </div>
              <h3 className="text-lg font-serif font-bold text-[#F7F3EA]">
                {item.title}
              </h3>
              <p className="text-xs text-[#D9D2C3]/80 font-sans leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center pt-8">
          <button
            onClick={onOpenConsultation}
            className="px-8 py-4 rounded-full bg-gradient-to-r from-[#C8A45D] via-[#DFC38A] to-[#C8A45D] text-[#101827] text-xs font-bold tracking-[0.18em] uppercase hover:scale-105 transition-all shadow-xl active:scale-95 cursor-pointer inline-flex items-center gap-2"
          >
            <span>Book 1-on-1 Meditation Guidance</span>
            <ArrowRight className="w-4 h-4 text-[#101827]" />
          </button>
        </div>
      </section>
    </div>
  );
};

// Interactive 108 Japa Bead Counter Component
const JapaMalaCounter: React.FC<{ playChime: (freq?: number) => void }> = ({ playChime }) => {
  const [beadCount, setBeadCount] = useState(0);
  const [completedMalas, setCompletedMalas] = useState(0);

  const handleAdvanceBead = () => {
    if (beadCount + 1 >= 108) {
      setBeadCount(0);
      setCompletedMalas(c => c + 1);
      playChime(528); // Festive completion chime
    } else {
      setBeadCount(b => b + 1);
      if ((beadCount + 1) % 27 === 0) {
        playChime(432); // Quarter mala milestone chime
      }
    }
  };

  const handleResetMala = () => {
    setBeadCount(0);
    setCompletedMalas(0);
  };

  const progressPercent = (beadCount / 108) * 100;

  return (
    <div className="rounded-3xl bg-[#182236]/90 border border-[#C8A45D]/40 p-8 sm:p-10 text-center shadow-xl space-y-6">
      <div className="space-y-1">
        <span className="text-xs uppercase tracking-[0.25em] font-sans font-bold text-[#DFC38A] block">
          Digital Japa Companion
        </span>
        <h3 className="text-2xl font-serif text-[#F7F3EA] font-light">
          108 Panchamukhi Rudraksha Counter
        </h3>
        <p className="text-xs text-[#D9D2C3]/75 font-sans max-w-md mx-auto">
          Tap the sacred mala ring during your daily mantra recitation. A harmonic chime signals every quarter cycle (27 beads) and full mala completion (108 beads).
        </p>
      </div>

      {/* Ring Visual & Button */}
      <div className="flex flex-col items-center justify-center py-4">
        <button
          onClick={handleAdvanceBead}
          className="w-48 h-48 rounded-full bg-gradient-to-tr from-[#101827] via-[#182236] to-[#2B211E] border-4 border-[#C8A45D] shadow-[0_0_40px_rgba(200,164,93,0.25)] flex flex-col items-center justify-center group hover:scale-105 active:scale-95 transition-all cursor-pointer relative overflow-hidden"
        >
          <span className="text-4xl font-serif font-bold text-[#DFC38A] group-hover:scale-110 transition-transform">
            {beadCount}
          </span>
          <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#D9D2C3]/70 mt-1">
            of 108 Beads
          </span>
          <span className="text-[10px] text-[#C8A45D] mt-2 font-mono uppercase tracking-wider">
            ✦ TAP TO ADVANCE ✦
          </span>
        </button>

        {/* Meter bar */}
        <div className="w-64 max-w-full mt-6 space-y-1.5">
          <div className="flex justify-between text-xs font-mono text-[#DFC38A]">
            <span>Mala Progress</span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-[#C8A45D] to-[#DFC38A] transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stats & Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs">
        <div className="text-left">
          <span className="text-gray-400 block text-[10px] uppercase tracking-wider">Completed Malas</span>
          <span className="font-serif font-bold text-lg text-[#F7F3EA]">
            {completedMalas} {completedMalas === 1 ? 'Round' : 'Rounds'} ({completedMalas * 108 + beadCount} Total Recitations)
          </span>
        </div>

        <button
          onClick={handleResetMala}
          className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#D9D2C3] hover:text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
        >
          Reset Count
        </button>
      </div>
    </div>
  );
};
