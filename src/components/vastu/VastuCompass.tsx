import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass as CompassIcon, 
  RotateCcw, 
  Camera, 
  CameraOff, 
  Smartphone, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Navigation,
  Move
} from 'lucide-react';
import { 
  VastuDirection, 
  VASTU_DIRECTIONS, 
  VASTU_DIRECTION_CENTERS, 
  getVastuZoneFromDegree 
} from '../../lib/vastu';

interface VastuCompassProps {
  onSelectZone?: (zone: VastuDirection) => void;
  selectedZoneCode?: string;
}

export const VastuCompass: React.FC<VastuCompassProps> = ({ 
  onSelectZone,
  selectedZoneCode 
}) => {
  // heading: Normalized 0..359° for Vastu zone lookup
  const [heading, setHeading] = useState<number>(45); 
  // displayAngle: Continuous cumulative rotation angle for CSS transform (prevents 360° flip at 0°)
  const [displayAngle, setDisplayAngle] = useState<number>(45);
  
  const [isLiveSensorActive, setIsLiveSensorActive] = useState<boolean>(false);
  const [hasSensorSupport, setHasSensorSupport] = useState<boolean>(false);
  const [permissionState, setPermissionState] = useState<'prompt' | 'granted' | 'denied' | 'unsupported'>('prompt');
  
  // Interactivity & Drag state
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);
  const [userExplicitlyDisabled, setUserExplicitlyDisabled] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Camera overlay state
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const compassContainerRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef<boolean>(false);

  const activeZone = getVastuZoneFromDegree(heading);

  // Shortest-Path Angle Unwrapping Update Helper
  // Prevents the 360° spinning unwording bug when crossing 0°/360° North
  const updateTargetHeading = (targetRawAngle: number) => {
    setDisplayAngle((prevDisplay) => {
      const currentNorm = ((prevDisplay % 360) + 360) % 360;
      let diff = targetRawAngle - currentNorm;

      // Shortest path around circle (-180° to +180°)
      while (diff < -180) diff += 360;
      while (diff > 180) diff -= 360;

      const nextDisplay = prevDisplay + diff;
      const nextNorm = Math.round(((nextDisplay % 360) + 360) % 360);
      
      setHeading(nextNorm);

      const zone = getVastuZoneFromDegree(nextNorm);
      if (onSelectZone) {
        onSelectZone(zone);
      }

      return nextDisplay;
    });
  };

  // Sync external selectedZoneCode if provided
  useEffect(() => {
    if (selectedZoneCode && VASTU_DIRECTION_CENTERS[selectedZoneCode] !== undefined) {
      if (!isLiveSensorActive && !isDraggingRef.current) {
        updateTargetHeading(VASTU_DIRECTION_CENTERS[selectedZoneCode]);
      }
    }
  }, [selectedZoneCode, isLiveSensorActive]);

  // Check device orientation availability on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      setHasSensorSupport(true);
    } else {
      setPermissionState('unsupported');
    }
  }, []);

  // Auto-activate live compass when phone physical motion/orientation is detected on page load
  useEffect(() => {
    if (userExplicitlyDisabled || isLiveSensorActive) return;

    const handleInitialMotion = (event: DeviceOrientationEvent) => {
      if (userExplicitlyDisabled || isLiveSensorActive) return;

      const webkitHeading = (event as unknown as { webkitCompassHeading?: number }).webkitCompassHeading;
      const alpha = event.alpha;

      const hasValidHeading = (typeof webkitHeading === 'number' && !isNaN(webkitHeading)) || (alpha !== null && alpha !== undefined);

      if (hasValidHeading) {
        setIsLiveSensorActive(true);
        if (!hasInteracted) setHasInteracted(true);
        window.removeEventListener('deviceorientation', handleInitialMotion, true);
      }
    };

    if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      window.addEventListener('deviceorientation', handleInitialMotion, true);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('deviceorientation', handleInitialMotion, true);
      }
    };
  }, [userExplicitlyDisabled, isLiveSensorActive, hasInteracted]);

  // Handle device orientation listener with shortest-path unwrapping
  useEffect(() => {
    if (!isLiveSensorActive) return;

    const handleOrientation = (event: DeviceOrientationEvent) => {
      let alpha = event.alpha;
      const webkitHeading = (event as unknown as { webkitCompassHeading?: number }).webkitCompassHeading;

      let rawHeading: number | null = null;
      if (typeof webkitHeading === 'number' && !isNaN(webkitHeading)) {
        rawHeading = webkitHeading;
      } else if (alpha !== null && alpha !== undefined) {
        rawHeading = (360 - alpha) % 360;
      }

      if (rawHeading !== null) {
        updateTargetHeading(Math.round(rawHeading));
      }
    };

    window.addEventListener('deviceorientation', handleOrientation, true);
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, [isLiveSensorActive]);

  // Request Live Compass Sensor Permission
  const requestSensorAccess = async () => {
    if (typeof window === 'undefined') return;

    const DeviceOrientationEventTyped = window.DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<'granted' | 'denied'>;
    };

    if (typeof DeviceOrientationEventTyped?.requestPermission === 'function') {
      try {
        const response = await DeviceOrientationEventTyped.requestPermission();
        if (response === 'granted') {
          setPermissionState('granted');
          setIsLiveSensorActive(true);
        } else {
          setPermissionState('denied');
          alert('Compass orientation permission denied. Use mouse/touch drag on laptop to rotate compass.');
        }
      } catch (err) {
        console.error('Error requesting orientation permission:', err);
        setPermissionState('denied');
      }
    } else {
      setPermissionState('granted');
      setIsLiveSensorActive(true);
    }
  };

  const toggleLiveSensor = () => {
    if (!hasInteracted) setHasInteracted(true);
    if (isLiveSensorActive) {
      setIsLiveSensorActive(false);
      setUserExplicitlyDisabled(true);
    } else {
      setUserExplicitlyDisabled(false);
      if (permissionState === 'granted') {
        setIsLiveSensorActive(true);
      } else {
        requestSensorAccess();
      }
    }
  };

  // Camera Overlay Toggle with Environment Fallback
  const toggleCamera = async () => {
    if (isCameraActive) {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
        setMediaStream(null);
      }
      setIsCameraActive(false);
    } else {
      try {
        let stream: MediaStream;
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: { ideal: 'environment' } }
          });
        } catch {
          stream = await navigator.mediaDevices.getUserMedia({
            video: true
          });
        }
        setMediaStream(stream);
        setIsCameraActive(true);
      } catch (err) {
        console.error('Camera access failed:', err);
        alert('Camera access unavailable or permission denied. Please allow camera permissions in your browser settings.');
      }
    }
  };

  // Assign stream to video element once mounted
  useEffect(() => {
    if (isCameraActive && mediaStream && videoRef.current) {
      videoRef.current.srcObject = mediaStream;
      videoRef.current.play().catch(err => {
        console.error('Error playing video stream:', err);
      });
    }
  }, [isCameraActive, mediaStream]);

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [mediaStream]);

  // Update heading manually
  const updateHeadingManually = (newHeading: number) => {
    if (!hasInteracted) setHasInteracted(true);
    if (isLiveSensorActive) {
      setIsLiveSensorActive(false);
    }
    updateTargetHeading(newHeading);
  };

  // Laptop Pointer Drag & Rotation Logic (Zero Latency & No Jump)
  const updateAngleFromPointer = (clientX: number, clientY: number) => {
    if (!compassContainerRef.current) return;
    const rect = compassContainerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = clientX - centerX;
    const dy = clientY - centerY;

    const rad = Math.atan2(dy, dx);
    const deg = (rad * 180) / Math.PI + 90; // 0° at Top (North)
    const normTarget = Math.round(((deg % 360) + 360) % 360);

    updateHeadingManually(normTarget);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    setIsDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    updateAngleFromPointer(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    updateAngleFromPointer(e.clientX, e.clientY);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      setIsDragging(false);
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 5 : -5;
    updateHeadingManually(heading + delta);
  };

  // Element theme styling
  const getElementTheme = (element: string) => {
    switch (element) {
      case 'Water':
        return {
          bg: 'from-cyan-950/90 to-blue-950/90',
          border: 'border-cyan-500/50',
          text: 'text-cyan-300',
          glow: 'rgba(6, 182, 212, 0.3)',
          badge: 'bg-cyan-500/20 text-cyan-200 border-cyan-500/40'
        };
      case 'Fire':
        return {
          bg: 'from-amber-950/90 to-rose-950/90',
          border: 'border-amber-500/50',
          text: 'text-amber-300',
          glow: 'rgba(245, 158, 11, 0.3)',
          badge: 'bg-amber-500/20 text-amber-200 border-amber-500/40'
        };
      case 'Earth':
        return {
          bg: 'from-amber-950/90 to-yellow-950/90',
          border: 'border-yellow-600/50',
          text: 'text-yellow-300',
          glow: 'rgba(202, 138, 4, 0.3)',
          badge: 'bg-yellow-600/20 text-yellow-200 border-yellow-600/40'
        };
      case 'Air':
        return {
          bg: 'from-emerald-950/90 to-teal-950/90',
          border: 'border-emerald-500/50',
          text: 'text-emerald-300',
          glow: 'rgba(16, 185, 129, 0.3)',
          badge: 'bg-emerald-500/20 text-emerald-200 border-emerald-500/40'
        };
      case 'Space (Akasha)':
      default:
        return {
          bg: 'from-indigo-950/90 to-purple-950/90',
          border: 'border-indigo-500/50',
          text: 'text-indigo-300',
          glow: 'rgba(99, 102, 241, 0.3)',
          badge: 'bg-indigo-500/20 text-indigo-200 border-indigo-500/40'
        };
    }
  };

  const theme = getElementTheme(activeZone.element);

  return (
    <div className="relative w-full max-w-5xl mx-auto bg-[#101827] text-[#F7F3EA] rounded-3xl p-4 sm:p-8 border border-[#C8A45D]/40 shadow-2xl overflow-hidden select-none">
      {/* Dynamic Element Glow */}
      <div 
        className="absolute inset-0 pointer-events-none transition-all duration-700 opacity-30"
        style={{
          background: `radial-gradient(circle at 50% 40%, ${theme.glow} 0%, rgba(16, 24, 39, 0) 70%)`
        }}
      />

      {/* Header Controls */}
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-[#C8A45D]/20">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#182236] border border-[#C8A45D]/40 text-[#DFC38A] text-xs font-bold uppercase tracking-widest">
            <CompassIcon className="w-3.5 h-3.5 text-[#C8A45D]" />
            <span>Interactive Vastu Spatial Compass</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-serif text-[#F7F3EA] mt-2 font-light">
            Real-Time Direction & Spatial Energy Compass
          </h3>
          <p className="text-xs text-[#D9D2C3]/70 font-sans mt-0.5">
            Click & drag dial on laptop or enable live mobile gyro to inspect Vastu zones.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {hasSensorSupport && (
            <button
              onClick={toggleLiveSensor}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer border ${
                isLiveSensorActive
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-900/50'
                  : 'bg-[#182236] text-[#DFC38A] border-[#C8A45D]/40 hover:bg-[#202b42]'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>{isLiveSensorActive ? 'Live Gyro Active' : 'Enable Mobile Gyro'}</span>
            </button>
          )}

          <button
            onClick={toggleCamera}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer border ${
              isCameraActive
                ? 'bg-[#C8A45D] text-slate-950 border-[#DFC38A] shadow-lg ring-2 ring-[#C8A45D]'
                : 'bg-[#182236] text-[#D9D2C3] border-[#C8A45D]/30 hover:bg-[#202b42]'
            }`}
          >
            {isCameraActive ? <CameraOff className="w-4 h-4 text-slate-950" /> : <Camera className="w-4 h-4 text-[#C8A45D]" />}
            <span>{isCameraActive ? 'Disable AR Camera' : 'Camera AR Overlay'}</span>
          </button>
        </div>
      </div>

      {/* Main Compass Grid */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 items-center">
        
        {/* Dial & Pointer Interaction Area */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center space-y-6">
          
          {/* Compass Dial Outer Shell */}
          <div 
            ref={compassContainerRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onWheel={handleWheel}
            className="relative w-72 h-72 sm:w-88 sm:h-88 flex items-center justify-center rounded-full bg-[#182236]/80 border-2 border-[#C8A45D]/50 shadow-[0_0_50px_rgba(200,164,93,0.2)] overflow-hidden cursor-grab active:cursor-grabbing touch-none group"
          >
            
            {/* Camera Feed Background Layer */}
            {isCameraActive && (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105 pointer-events-none z-0"
              />
            )}

            {/* Top Facing Target Marker */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center pointer-events-none">
              <div className="w-0 h-0 border-l-[9px] border-l-transparent border-r-[9px] border-r-transparent border-t-[16px] border-t-[#C8A45D] filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] animate-pulse" />
              <span className="text-[9px] font-mono tracking-widest text-[#DFC38A] uppercase font-bold mt-0.5 bg-[#101827]/90 px-2 py-0.5 rounded border border-[#C8A45D]/40 shadow-md">
                Facing Target
              </span>
            </div>

            {/* ROTATING COMPASS DIAL (Using continuous displayAngle to prevent 360° flip at 0°) */}
            <div
              className={`relative w-full h-full rounded-full flex items-center justify-center z-10 ${
                isDragging ? 'transition-none' : 'transition-transform duration-300 ease-out'
              }`}
              style={{ transform: `rotate(${-displayAngle}deg)` }}
            >
              {/* Outer Sector & Degree Track SVG */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 400">
                <circle cx="200" cy="200" r="190" fill="none" stroke="#C8A45D" strokeWidth="1" strokeDasharray="2 6" opacity="0.4" />
                <circle cx="200" cy="200" r="175" fill="none" stroke="#DFC38A" strokeWidth="1.5" opacity="0.7" />
                <circle cx="200" cy="200" r="130" fill="none" stroke="#C8A45D" strokeWidth="1" opacity="0.3" />

                {/* 8 Rays */}
                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, idx) => {
                  const rad = ((angle - 90) * Math.PI) / 180;
                  const x1 = 200 + 130 * Math.cos(rad);
                  const y1 = 200 + 130 * Math.sin(rad);
                  const x2 = 200 + 175 * Math.cos(rad);
                  const y2 = 200 + 175 * Math.sin(rad);
                  return (
                    <line key={idx} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#C8A45D" strokeWidth="1.5" opacity="0.5" />
                  );
                })}

                {/* Degree ticks */}
                {Array.from({ length: 24 }).map((_, idx) => {
                  const angle = idx * 15;
                  const rad = ((angle - 90) * Math.PI) / 180;
                  const x1 = 200 + 165 * Math.cos(rad);
                  const y1 = 200 + 165 * Math.sin(rad);
                  const x2 = 200 + 173 * Math.cos(rad);
                  const y2 = 200 + 173 * Math.sin(rad);
                  return (
                    <line key={idx} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#DFC38A" strokeWidth="1" opacity="0.4" />
                  );
                })}
              </svg>

              {/* 8 Direction Labels */}
              {VASTU_DIRECTIONS.map((dir) => {
                const angle = VASTU_DIRECTION_CENTERS[dir.code];
                const rad = ((angle - 90) * Math.PI) / 180;
                const r = 148;
                const left = 50 + (r / 200) * 50 * Math.cos(rad);
                const top = 50 + (r / 200) * 50 * Math.sin(rad);

                const isActive = activeZone.code === dir.code;

                return (
                  <button
                    key={dir.code}
                    onClick={(e) => {
                      e.stopPropagation();
                      updateHeadingManually(angle);
                    }}
                    style={{ left: `${left}%`, top: `${top}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center w-10 h-10 rounded-full transition-all cursor-pointer z-20 ${
                      isActive
                        ? 'bg-[#C8A45D] text-slate-950 font-bold scale-110 shadow-[0_0_15px_rgba(200,164,93,0.9)] ring-2 ring-[#DFC38A]'
                        : 'bg-[#101827]/90 text-[#D9D2C3] hover:bg-[#C8A45D]/40 hover:text-white border border-[#C8A45D]/30'
                    }`}
                  >
                    <span className="text-xs font-serif font-bold leading-none">{dir.code}</span>
                    <span className="text-[7px] opacity-80 uppercase leading-tight font-mono">{angle}°</span>
                  </button>
                );
              })}

              {/* Central Magnetic Needle */}
              <div className="relative z-10 w-16 h-16 flex items-center justify-center pointer-events-none">
                <svg className="w-48 h-48 drop-shadow-2xl" viewBox="0 0 100 100">
                  <polygon points="50,10 44,50 56,50" fill="url(#northNeedleGrad)" />
                  <polygon points="50,90 44,50 56,50" fill="url(#southNeedleGrad)" />
                  <circle cx="50" cy="50" r="6" fill="#C8A45D" stroke="#F7F3EA" strokeWidth="2" />
                  <circle cx="50" cy="50" r="2" fill="#101827" />

                  <defs>
                    <linearGradient id="northNeedleGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#E11D48" />
                      <stop offset="50%" stopColor="#C8A45D" />
                      <stop offset="100%" stopColor="#F59E0B" />
                    </linearGradient>
                    <linearGradient id="southNeedleGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#475569" />
                      <stop offset="50%" stopColor="#94A3B8" />
                      <stop offset="100%" stopColor="#334155" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </div>

          {/* Dynamic Helper Pill */}
          <AnimatePresence>
            {!hasInteracted && !isLiveSensorActive && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#182236] border border-[#C8A45D]/40 text-[#DFC38A] text-[11px] font-sans shadow-md"
              >
                <Move className="w-3.5 h-3.5 text-[#C8A45D] animate-bounce" />
                <span>Drag dial directly or scroll mouse wheel to rotate direction</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Heading Control Box */}
          <div className="w-full max-w-md bg-[#182236] p-4 rounded-2xl border border-[#C8A45D]/30 space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-[#C8A45D]" />
                <span className="text-xs uppercase font-bold tracking-wider text-[#DFC38A]">
                  Active Orientation
                </span>
              </div>
              <span className="text-lg font-mono font-bold text-[#F7F3EA]">
                {heading}° <span className="text-xs font-serif text-[#C8A45D]">({activeZone.code} - {activeZone.sanskritName.split(' ')[0]})</span>
              </span>
            </div>

            {/* Slider & Fine Tuning */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => updateHeadingManually(heading - 5)}
                className="px-2.5 py-1.5 rounded bg-[#101827] text-xs font-mono text-[#D9D2C3] hover:text-[#C8A45D] hover:border-[#C8A45D] border border-[#C8A45D]/30 cursor-pointer"
                title="Rotate -5°"
              >
                -5°
              </button>

              <input
                type="range"
                min="0"
                max="359"
                value={heading}
                onChange={(e) => updateHeadingManually(parseInt(e.target.value, 10))}
                className="w-full accent-[#C8A45D] cursor-pointer h-2 bg-[#101827] rounded-lg"
              />

              <button
                onClick={() => updateHeadingManually(heading + 5)}
                className="px-2.5 py-1.5 rounded bg-[#101827] text-xs font-mono text-[#D9D2C3] hover:text-[#C8A45D] hover:border-[#C8A45D] border border-[#C8A45D]/30 cursor-pointer"
                title="Rotate +5°"
              >
                +5°
              </button>

              <button
                onClick={() => updateHeadingManually(0)}
                className="p-2 rounded bg-[#101827] text-[#D9D2C3] hover:text-[#C8A45D] hover:border-[#C8A45D] border border-[#C8A45D]/30 cursor-pointer"
                title="Reset to True North (0°)"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 8 Preset Buttons */}
            <div className="grid grid-cols-8 gap-1 pt-1">
              {VASTU_DIRECTIONS.map(dir => (
                <button
                  key={dir.code}
                  onClick={() => updateHeadingManually(VASTU_DIRECTION_CENTERS[dir.code])}
                  className={`py-1.5 rounded text-[10px] font-mono font-bold uppercase transition-all cursor-pointer ${
                    activeZone.code === dir.code
                      ? 'bg-[#C8A45D] text-slate-950 font-extrabold shadow'
                      : 'bg-[#101827] text-[#D9D2C3]/80 hover:bg-[#202b42] hover:text-white'
                  }`}
                >
                  {dir.code}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Vastu Zone Details */}
        <div className="lg:col-span-5 space-y-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeZone.code}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className={`p-6 rounded-3xl bg-gradient-to-br ${theme.bg} border ${theme.border} space-y-4 shadow-xl`}
            >
              {/* Header */}
              <div className="flex items-start justify-between pb-3 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${theme.badge}`}>
                      {activeZone.code} Zone ({activeZone.degreeRange})
                    </span>
                  </div>
                  <h4 className="text-2xl font-serif font-bold text-white mt-1">
                    {activeZone.name}
                  </h4>
                  <p className="text-xs text-white/70 font-serif italic">
                    {activeZone.sanskritName}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[9px] uppercase tracking-widest text-[#DFC38A] block font-bold">
                    Ruling Deity
                  </span>
                  <span className="text-sm font-serif font-bold text-white">
                    {activeZone.deity}
                  </span>
                </div>
              </div>

              {/* Element Info */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-black/30 p-3 rounded-xl border border-white/10">
                <div>
                  <span className="text-[10px] text-white/60 uppercase block font-mono">Governing Element</span>
                  <span className={`font-semibold ${theme.text}`}>{activeZone.element}</span>
                </div>
                <div>
                  <span className="text-[10px] text-white/60 uppercase block font-mono">Ruling Planet</span>
                  <span className="font-semibold text-white">{activeZone.rulingPlanet}</span>
                </div>
              </div>

              {/* Energy Vibration Description */}
              <p className="text-xs text-white/90 leading-relaxed font-sans bg-black/20 p-3 rounded-xl border border-white/5">
                {activeZone.energyQuality}
              </p>

              {/* Ideal Spaces */}
              <div className="space-y-1.5">
                <h5 className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Optimal Space Placements</span>
                </h5>
                <ul className="space-y-1 text-xs text-white/80 pl-1">
                  {activeZone.idealFor.slice(0, 3).map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Placements to Avoid */}
              <div className="space-y-1.5">
                <h5 className="text-[11px] font-bold uppercase tracking-wider text-rose-300 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                  <span>Incompatible Placements</span>
                </h5>
                <ul className="space-y-1 text-xs text-white/80 pl-1">
                  {activeZone.avoidInThisZone.slice(0, 2).map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Remedy Card */}
              <div className="p-3.5 rounded-xl bg-black/50 border border-[#C8A45D]/40 space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#DFC38A] flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#C8A45D]" />
                  <span>Non-Destructive Vastu Remedy</span>
                </span>
                <p className="text-xs text-white/95 leading-relaxed font-sans">
                  {activeZone.remedies}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};
