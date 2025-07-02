"use client";

export default function Footer() {
  return (
    <footer className="bg-white border-t backdrop-blur-sm" style={{ minHeight: 'auto' }}>
      <div className="max-w-[clamp(640px,90vw,1920px)] mx-auto px-[clamp(1rem,2vw,1.5rem)] sm:px-[clamp(1.5rem,3vw,2rem)] lg:px-[clamp(2rem,4vw,3rem)] py-[clamp(0.75rem,1.5vw,1.25rem)] sm:py-[clamp(1rem,2vw,1.5rem)]">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-[clamp(0.25rem,0.5vw,0.5rem)] sm:gap-[clamp(0.5rem,1vw,1rem)] text-[clamp(0.7rem,1.2vw,0.875rem)] sm:text-[clamp(0.75rem,1.5vw,1rem)] text-gray-600">
          <span className="text-center sm:text-left">© 2024 VJU SPORT</span>
          <span className="hidden sm:inline">|</span>
          <span className="text-center sm:text-left">All rights reserved</span>
        </div>
      </div>
    </footer>
  );
}