'use client';

import { Artist, Track, Album } from '@/types/music';
import { formatNumber, formatDuration, getArtistBio } from '@/lib/deezer-api';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import CountUp from 'react-countup';
import FluidCursor from './FluidCursor';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ArtistPageProps {
  artist: Artist;
  tracks: Track[];
  albums: Album[];
}

export default function ArtistPage({ artist, tracks, albums }: ArtistPageProps) {
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [playingTrackId, setPlayingTrackId] = useState<number | null>(null);
  const [startCount, setStartCount] = useState(false);
  const [artistBio, setArtistBio] = useState(`${artist.name} is a talented artist with a diverse musical catalog. Explore their top tracks and albums below.`);
  const albumsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const tracksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
    };
  }, [currentAudio]);

  // Fetch artist bio from Wikipedia
  useEffect(() => {
    const fetchBio = async () => {
      const bio = await getArtistBio(artist.name);
      setArtistBio(bio);
    };
    fetchBio();
  }, [artist.name]);

  // Intersection Observer for CountUp animation
  useEffect(() => {
    if (!statsRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !startCount) {
            setStartCount(true);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, [startCount]);

  // GSAP ScrollTrigger for tracks stagger animation
  useEffect(() => {
    if (!tracksRef.current) return;

    const tracks = tracksRef.current.querySelectorAll('.track-item');
    
    gsap.fromTo(
      tracks,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: tracksRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      }
    );
  }, []);

  // Pause animation on hover
  useEffect(() => {
    const albumsContainer = albumsRef.current;
    if (!albumsContainer) return;

    const scrollContainer = albumsContainer.querySelector('.albums-scroll') as HTMLElement;
    if (!scrollContainer) return;

    const handleMouseEnter = () => {
      scrollContainer.style.animationPlayState = 'paused';
    };

    const handleMouseLeave = () => {
      scrollContainer.style.animationPlayState = 'running';
    };

    albumsContainer.addEventListener('mouseenter', handleMouseEnter);
    albumsContainer.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      albumsContainer.removeEventListener('mouseenter', handleMouseEnter);
      albumsContainer.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const playPreview = (url: string, trackId: number) => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    if (playingTrackId === trackId) {
      setPlayingTrackId(null);
      setCurrentAudio(null);
      return;
    }

    if (url) {
      const audio = new Audio(url);
      audio.volume = 0.5;
      audio.play().catch(console.error);
      setCurrentAudio(audio);
      setPlayingTrackId(trackId);

      audio.addEventListener('ended', () => {
        setPlayingTrackId(null);
        setCurrentAudio(null);
      });
    }
  };

  // Parse numbers for CountUp
  const albumCount = parseInt(artist.nb_album?.toString() || '0');
  const fanCount = artist.nb_fan || 0;

  return (
    <div className="min-h-screen bg-[#121212] cursor-none">
      <FluidCursor />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 px-20 py-10 flex justify-between items-center z-[1000] opacity-100">
        <div className="nav-left">
          <Link 
            href="/" 
            className="text-[11px] font-light tracking-[0.15em] uppercase text-[rgba(255,255,255,0.3)] hover:text-[rgba(255,255,255,1)] hover:tracking-[0.2em] transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
          >
            ← back
          </Link>
        </div>
        <div className="nav-right">
          <span className="text-xs font-light tracking-[0.25em] uppercase text-[#f5f5f5]">mg</span>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute top-0 left-0 w-full h-full bg-cover bg-center opacity-15 blur-0 scale-110"
          style={{ backgroundImage: `url(${artist.picture_xl || artist.picture_big})` }}
        >
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,transparent_0%,#0b0b0b_70%)]" />
        </div>

        <div className="relative z-[2] text-center px-10">
          {/* Text Pressure Effect */}
          <h1 
            className="text-[clamp(4rem,12vw,12rem)] font-extralight tracking-[-0.05em] leading-[0.9] lowercase mb-[30px] transition-all duration-300"
            style={{
              fontVariationSettings: `'wght' 200`,
              textShadow: '0 4px 60px rgba(0,0,0,0.5)'
            }}
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const width = rect.width;
              const pressure = Math.abs((x / width) - 0.5) * 2;
              e.currentTarget.style.fontVariationSettings = `'wght' ${200 + pressure * 300}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.fontVariationSettings = `'wght' 200`;
            }}
          >
            {artist.name}
          </h1>
          <p className="text-xs font-light tracking-[0.3em] uppercase text-[#c9b896]">
            artist
          </p>
        </div>

        <div className="absolute bottom-[60px] left-1/2 -translate-x-1/2 flex flex-col items-center gap-[15px] opacity-60">
          <span className="text-[9px] font-light tracking-[0.25em] uppercase text-[rgba(255,255,255,0.3)]">
            scroll
          </span>
          <div className="w-px h-[50px] bg-gradient-to-b from-[rgba(255,255,255,0.3)] to-transparent" />
        </div>
      </section>

      {/* About Section */}
      <section className="relative min-h-screen flex items-center px-20 py-[120px] bg-[#121212]">
        <div className="grid grid-cols-2 gap-[120px] max-w-[1600px] mx-auto w-full">
          <div className="relative w-full aspect-[3/4] overflow-hidden opacity-0 animate-fadeInUp rounded-sm">
            <img
              src={artist.picture_xl || artist.picture_big}
              alt={artist.name}
              className="w-full h-full object-cover grayscale-0 contrast-[1.05] brightness-100 opacity-100"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = artist.picture_big || artist.picture_medium || '';
              }}
            />
          </div>

          <div className="flex flex-col justify-center gap-10 opacity-0 animate-fadeInUp" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
            <h2 className="text-[10px] font-light tracking-[0.3em] uppercase text-[#c9b896] mb-[30px]">
              about
            </h2>
            <p className="text-lg font-light leading-[1.9] text-[rgba(255,255,255,0.75)] tracking-[-0.01em] max-w-[600px]">
              {artistBio}
            </p>

            <div ref={statsRef} className="grid grid-cols-2 gap-12 mt-12">
              <div className="flex flex-col gap-[12px]">
                <span className="text-7xl font-extralight tracking-[0.02em] text-[#f5f5f5]" style={{ fontStretch: 'expanded' }}>
                  {startCount ? (
                    <CountUp end={albumCount} duration={2.5} separator="," />
                  ) : (
                    '0'
                  )}
                </span>
                <span className="text-[11px] font-light tracking-[0.25em] uppercase text-[rgba(255,255,255,0.3)]">
                  albums
                </span>
              </div>
              <div className="flex flex-col gap-[12px]">
                <span className="text-7xl font-extralight tracking-[0.02em] text-[#f5f5f5]" style={{ fontStretch: 'expanded' }}>
                  {startCount ? (
                    <CountUp 
                      end={fanCount} 
                      duration={2.5} 
                      separator="," 
                      formattingFn={(value) => formatNumber(value)}
                    />
                  ) : (
                    '0'
                  )}
                </span>
                <span className="text-[11px] font-light tracking-[0.25em] uppercase text-[rgba(255,255,255,0.3)]">
                  fans
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Tracks Section */}
      <section className="px-20 py-[120px] bg-[#050505]">
        <div className="mb-20">
          <h2 className="text-[clamp(3rem,6vw,5rem)] font-extralight tracking-[-0.04em] lowercase">
            top tracks
          </h2>
        </div>

        <div ref={tracksRef} className="grid grid-cols-1 gap-[2px] bg-[rgba(255,255,255,0.02)]">
          {tracks.map((track, index) => (
            <div
              key={track.id}
              className="track-item bg-[#0b0b0b] px-10 py-[30px] grid grid-cols-[60px_1fr_auto_auto] gap-[30px] items-center cursor-pointer transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[rgba(255,255,255,0.02)] group"
              onClick={() => track.preview && playPreview(track.preview, track.id)}
            >
              <div className="text-sm font-light text-[rgba(255,255,255,0.3)]">
                {(index + 1).toString().padStart(2, '0')}
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-lg font-normal tracking-[-0.02em] text-[#f5f5f5]">
                  {track.title}
                </div>
                <div className="text-xs font-light text-[rgba(255,255,255,0.3)]">
                  {track.album.title}
                </div>
              </div>
              <div className="text-[13px] font-light text-[rgba(255,255,255,0.3)]">
                {formatDuration(track.duration)}
              </div>
              <button 
                className={`w-10 h-10 border border-[rgba(255,255,255,0.1)] bg-transparent rounded-full flex items-center justify-center cursor-pointer transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] text-[#f5f5f5] text-[10px] ${playingTrackId === track.id ? 'opacity-100 border-[rgba(255,255,255,0.3)]' : 'opacity-0 group-hover:opacity-100 group-hover:border-[rgba(255,255,255,0.3)]'}`}
              >
                {playingTrackId === track.id ? '⏸' : '▶'}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Albums Section with Horizontal Scroll */}
      <section 
        ref={albumsRef}
        className="py-[120px] bg-[#121212] overflow-hidden"
      >
        <div className="mb-20 px-20">
          <h2 className="text-[clamp(3rem,6vw,5rem)] font-extralight tracking-[-0.04em] lowercase">
            albums
          </h2>
          <p className="text-[10px] font-light tracking-[0.2em] uppercase text-[rgba(255,255,255,0.3)] mt-4">
            scroll horizontally to explore
          </p>
        </div>

        <div className="relative w-full overflow-hidden">
          {/* Infinite scroll container */}
          <div 
            className="albums-scroll flex gap-8 pb-5"
            style={{
              animation: 'infiniteScrollSlow 80s linear infinite',
              width: 'max-content'
            }}
          >
            {/* Original albums */}
            {albums.map((album) => (
              <div
                key={`original-${album.id}`}
                className="min-w-[270px] flex-shrink-0 cursor-pointer transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-[10px] hover:scale-105 group"
              >
                <div className="relative overflow-hidden rounded-sm mb-5">
                  <img
                    src={album.cover_big || album.cover_medium}
                    alt={album.title}
                    className="w-full aspect-square object-cover opacity-90 transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100 group-hover:scale-105"
                  />
                  {/* Overlay with album info */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-[600ms] ease-out flex flex-col justify-end p-6">
                    <div className="text-sm font-normal text-[#f5f5f5] mb-1 line-clamp-2">
                      {album.title}
                    </div>
                    <div className="text-[10px] font-light text-[rgba(212,197,169,0.8)] tracking-[0.15em] uppercase">
                      {artist.name}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 px-2">
                  <div className="text-sm font-normal tracking-[-0.02em] text-[#f5f5f5] line-clamp-1">
                    {album.title}
                  </div>
                  <div className="text-[10px] font-light text-[rgba(255,255,255,0.3)] tracking-[0.12em]">
                    {album.release_date ? new Date(album.release_date).getFullYear() : ''}
                  </div>
                </div>
              </div>
            ))}
            {/* Duplicate albums for seamless loop */}
            {albums.map((album) => (
              <div
                key={`duplicate-${album.id}`}
                className="min-w-[270px] flex-shrink-0 cursor-pointer transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-[10px] hover:scale-105 group"
              >
                <div className="relative overflow-hidden rounded-sm mb-5">
                  <img
                    src={album.cover_big || album.cover_medium}
                    alt={album.title}
                    className="w-full aspect-square object-cover opacity-90 transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-[600ms] ease-out flex flex-col justify-end p-6">
                    <div className="text-sm font-normal text-[#f5f5f5] mb-1 line-clamp-2">
                      {album.title}
                    </div>
                    <div className="text-[10px] font-light text-[rgba(212,197,169,0.8)] tracking-[0.15em] uppercase">
                      {artist.name}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 px-2">
                  <div className="text-sm font-normal tracking-[-0.02em] text-[#f5f5f5] line-clamp-1">
                    {album.title}
                  </div>
                  <div className="text-[10px] font-light text-[rgba(255,255,255,0.3)] tracking-[0.12em]">
                    {album.release_date ? new Date(album.release_date).getFullYear() : ''}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-20 py-20 pb-[60px] bg-[#050505] border-t border-[rgba(255,255,255,0.04)]">
        <div className="text-center">
          <p className="text-[9px] font-extralight tracking-[0.2em] uppercase text-[rgba(255,255,255,0.3)]">
            © 2025 music gallery
          </p>
        </div>
      </footer>
    </div>
  );
}
