export default function Footer() {
  return (
    <footer className="mt-32 px-16 md:px-24 py-24 pb-16 border-t border-[rgba(255,255,255,0.04)] bg-gradient-to-b from-[#0b0b0b] to-[#050505]">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-16 items-center max-w-7xl mx-auto">
        <div className="flex flex-col items-start opacity-0 animate-fadeInUp" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
          <p className="text-[10px] font-extralight tracking-[0.25em] uppercase text-[rgba(248,246,243,0.25)] leading-relaxed">
            curated sonic<br />experiences
          </p>
        </div>
        <div className="flex flex-col items-center opacity-0 animate-fadeInUp" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
          <div className="flex gap-8">
            <a 
              href="#" 
              className="relative text-[9px] font-extralight tracking-[0.25em] uppercase text-[rgba(248,246,243,0.25)] hover:text-[rgba(212,197,169,0.8)] transition-all duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)] group"
            >
              privacy
              <span className="absolute -bottom-1 left-0 w-0 h-[0.5px] bg-[#d4c5a9] group-hover:w-full transition-all duration-700" />
            </a>
            <a 
              href="#" 
              className="relative text-[9px] font-extralight tracking-[0.25em] uppercase text-[rgba(248,246,243,0.25)] hover:text-[rgba(212,197,169,0.8)] transition-all duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)] group"
            >
              terms
              <span className="absolute -bottom-1 left-0 w-0 h-[0.5px] bg-[#d4c5a9] group-hover:w-full transition-all duration-700" />
            </a>
            <a 
              href="#" 
              className="relative text-[9px] font-extralight tracking-[0.25em] uppercase text-[rgba(248,246,243,0.25)] hover:text-[rgba(212,197,169,0.8)] transition-all duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)] group"
            >
              contact
              <span className="absolute -bottom-1 left-0 w-0 h-[0.5px] bg-[#d4c5a9] group-hover:w-full transition-all duration-700" />
            </a>
          </div>
        </div>
        <div className="flex flex-col items-end opacity-0 animate-fadeInUp" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
          <p className="text-[8px] font-extralight tracking-[0.3em] uppercase text-[rgba(248,246,243,0.15)]">
            © 2025
          </p>
        </div>
      </div>
    </footer>
  );
}
