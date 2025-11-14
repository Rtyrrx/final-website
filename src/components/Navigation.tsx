import Link from 'next/link';

export default function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 px-16 md:px-24 py-10 flex justify-between items-center bg-[rgba(11,11,11,0.6)] backdrop-blur-ultra border-b border-[rgba(255,255,255,0.03)] z-[1000] animate-fadeInDown">
      <div className="nav-left">
        <span className="text-xs font-light tracking-[0.3em] uppercase text-[rgba(248,246,243,0.9)] transition-all duration-700 hover:tracking-[0.4em] hover:text-[#d4c5a9]">
          music gallery
        </span>
      </div>
      <div className="nav-right flex gap-12">
        <Link 
          href="/" 
          className="relative text-[10px] font-light tracking-[0.2em] uppercase text-[rgba(248,246,243,0.35)] hover:text-[rgba(248,246,243,0.95)] transition-all duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)] group"
        >
          explore
          <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#d4c5a9] group-hover:w-full transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]" />
        </Link>
        <a 
          href="#" 
          className="relative text-[10px] font-light tracking-[0.2em] uppercase text-[rgba(248,246,243,0.35)] hover:text-[rgba(248,246,243,0.95)] transition-all duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)] group"
        >
          curated
          <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#d4c5a9] group-hover:w-full transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]" />
        </a>
        <a 
          href="#" 
          className="relative text-[10px] font-light tracking-[0.2em] uppercase text-[rgba(248,246,243,0.35)] hover:text-[rgba(248,246,243,0.95)] transition-all duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)] group"
        >
          about
          <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#d4c5a9] group-hover:w-full transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]" />
        </a>
      </div>
    </nav>
  );
}
