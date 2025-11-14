'use client';

import { Track } from '@/types/music';
import Link from 'next/link';
import { useState, useRef } from 'react';

interface MusicCardProps {
  song: Track;
  index: number;
}

export default function MusicCard({ song, index }: MusicCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (song.preview && audioRef.current) {
      audioRef.current.play().catch(console.error);
      setIsPlaying(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  return (
    <Link 
      href={`/artist/${song.artist.id}`}
      className={`group relative bg-[#0b0b0b] overflow-hidden transition-all duration-[1400ms] ease-[cubic-bezier(0.19,1,0.22,1)] cursor-pointer aspect-square block border border-[rgba(255,255,255,0.02)] hover:border-[rgba(212,197,169,0.15)] animate-fadeInUp ${isPlaying ? 'bg-[#0f0f0f]' : ''}`}
      style={{ 
        animationDelay: `${index * 0.08}s`,
        animationFillMode: 'forwards'
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Image with cinematic reveal */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={song.album.cover_big || song.album.cover_medium || song.album.cover}
          alt={`${song.title} cover`}
          className={`w-full h-full object-cover transition-all duration-[1600ms] ease-[cubic-bezier(0.19,1,0.22,1)] ${
            isHovered ? 'opacity-100 scale-105' : 'opacity-75 scale-100'
          }`}
          loading="lazy"
        />
        {/* Gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent transition-opacity duration-[1200ms] ${
          isHovered ? 'opacity-80' : 'opacity-60'
        }`} />
      </div>
      
      {/* Content overlay with dreamy animation */}
      <div className={`absolute inset-0 p-8 flex flex-col justify-end z-10 transition-all duration-[1200ms] ease-[cubic-bezier(0.19,1,0.22,1)] ${
        isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}>
        <div className="flex flex-col gap-3">
          <div className="text-xl font-light text-[#f8f6f3] tracking-tight leading-[1.3] line-clamp-2 text-shadow-soft transition-all duration-700 group-hover:tracking-normal mb-1">
            {song.title}
          </div>
          <div className="text-[11px] text-[rgba(212,197,169,0.85)] tracking-[0.15em] uppercase font-extralight leading-[1.4]">
            {song.artist.name}
          </div>
          <div className="text-[9px] text-[rgba(248,246,243,0.45)] tracking-[0.12em] uppercase font-extralight line-clamp-1 leading-[1.3]">
            {song.album.title}
          </div>
        </div>
      </div>

      {/* Playing indicator with subtle glow */}
      {isPlaying && (
        <div className="absolute top-8 right-8 bg-[rgba(11,11,11,0.85)] backdrop-blur-md text-[rgba(212,197,169,0.95)] text-[8px] font-light tracking-[0.28em] uppercase opacity-100 transition-all duration-[1000ms] ease-[cubic-bezier(0.19,1,0.22,1)] pointer-events-none z-30 border border-[rgba(212,197,169,0.35)] px-5 py-2.5 glow-subtle animate-drift rounded-sm">
          PLAYING
        </div>
      )}

      {/* Hover accent line */}
      <div className={`absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#d4c5a9] to-transparent transition-opacity duration-1000 ${
        isHovered ? 'opacity-40' : 'opacity-0'
      }`} />

      {song.preview && (
        <audio 
          ref={audioRef}
          src={song.preview}
          preload="metadata"
          className="hidden"
        />
      )}
    </Link>
  );
}
