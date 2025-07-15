"use client";

export default function Footer() {
  return (
    <footer
      className="w-full border-t border-neutral-200/60 bg-white/60 backdrop-blur-md shadow-[0_2px_16px_0_rgba(80,80,120,0.06)] relative z-10 transition-all duration-300"
      style={{ minHeight: 'auto' }}
    >
      <div className="max-w-[clamp(640px,90vw,1920px)] mx-auto px-[clamp(1rem,2vw,1.5rem)] sm:px-[clamp(1.5rem,3vw,2rem)] lg:px-[clamp(2rem,4vw,3rem)] py-[clamp(0.75rem,1.5vw,1.25rem)] sm:py-[clamp(1rem,2vw,1.5rem)] flex flex-col items-center justify-center gap-2 relative">
        {/* Glassmorphism gradient overlay */}
        <div className="pointer-events-none absolute inset-0 rounded-none bg-gradient-to-tr from-white/60 via-white/40 to-blue-100/30 opacity-80 -z-10" />
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-[clamp(0.8rem,1.2vw,1rem)] text-neutral-700 font-medium select-none">
          <span className="text-center sm:text-left">© 2024 <span className="font-semibold tracking-wide text-blue-700 transition-colors duration-200 hover:text-blue-500">VJU SPORT</span></span>
          <span className="hidden sm:inline text-neutral-400">|</span>
          <span className="text-center sm:text-left">All rights reserved</span>
        </div>
      </div>
    </footer>
  );
}