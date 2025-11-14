'use client';

import { useState, useEffect, useRef } from 'react';
import { Track, SortOption } from '@/types/music';
import { getRandomSongs, searchTracks } from '@/lib/deezer-api';
import MusicCard from '@/components/MusicCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HomePage() {
  const [songs, setSongs] = useState<Track[]>([]);
  const [allSongs, setAllSongs] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('default');
  
  const headerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadInitialSongs();
  }, []);

  // GSAP Animations
  useEffect(() => {
    if (!headerRef.current || !titleRef.current || !searchRef.current) return;

    // Set initial visibility
    gsap.set(searchRef.current.children, { opacity: 1, x: 0 });

    // Parallax effect on header
    gsap.to(headerRef.current, {
      scrollTrigger: {
        trigger: headerRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5
      },
      y: 150,
      opacity: 0.5,
      ease: 'none'
    });

    // Title split and animate
    const titleChars = titleRef.current.textContent?.split('') || [];
    titleRef.current.innerHTML = titleChars
      .map(char => `<span class="inline-block">${char === ' ' ? '&nbsp;' : char}</span>`)
      .join('');
    
    gsap.from(titleRef.current.children, {
      opacity: 0,
      y: 50,
      rotationX: -90,
      stagger: 0.02,
      duration: 1.2,
      ease: 'power4.out',
      delay: 0.3
    });

    // Search bar entrance
    gsap.from(searchRef.current.children, {
      opacity: 0,
      x: -30,
      stagger: 0.15,
      duration: 1,
      ease: 'power3.out',
      delay: 0.8
    });
  }, []);

  // Grid stagger animation when songs load
  useEffect(() => {
    if (!gridRef.current || songs.length === 0) return;

    const cards = gridRef.current.children;
    gsap.from(cards, {
      opacity: 0,
      y: 60,
      scale: 0.9,
      stagger: {
        amount: 1.2,
        from: 'random'
      },
      duration: 0.8,
      ease: 'power2.out',
      clearProps: 'all'
    });
  }, [songs]);

  const loadInitialSongs = async () => {
    try {
      setLoading(true);
      const randomSongs = await getRandomSongs();
      setSongs(randomSongs);
      setAllSongs(randomSongs);
    } catch (err) {
      setError('Unable to load songs. Please check your connection.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError('Please enter a search term');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const results = await searchTracks(searchQuery);
      
      if (results.length > 0) {
        setSongs(results);
        setAllSongs(results);
      } else {
        setError('No results found. Try a different search.');
      }
    } catch (err) {
      setError('Search failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (value: SortOption) => {
    setSortOption(value);
    let sortedSongs = [...allSongs];

    switch (value) {
      case 'title-asc':
        sortedSongs.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'title-desc':
        sortedSongs.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'artist-asc':
        sortedSongs.sort((a, b) => a.artist.name.localeCompare(b.artist.name));
        break;
      case 'artist-desc':
        sortedSongs.sort((a, b) => b.artist.name.localeCompare(a.artist.name));
        break;
      case 'duration-asc':
        sortedSongs.sort((a, b) => a.duration - b.duration);
        break;
      case 'duration-desc':
        sortedSongs.sort((a, b) => b.duration - a.duration);
        break;
      case 'random':
        sortedSongs.sort(() => Math.random() - 0.5);
        break;
      default:
        break;
    }

    setSongs(sortedSongs);
  };

  return (
    <div className="max-w-full mx-0 p-0 pt-[120px]">
      <header ref={headerRef} className="relative text-left px-16 md:px-24 py-40 pb-32 border-b border-[rgba(255,255,255,0.03)] overflow-hidden">
        {/* Ambient background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0b0b0b] via-[#0e0c0a] to-[#0b0b0b] opacity-60" />
        
        <div className="relative z-10">
          <h1 ref={titleRef} className="text-[#f8f6f3] text-[clamp(5rem,12vw,12rem)] mb-40 font-extralight tracking-[-0.04em] leading-[0.88] lowercase text-shadow-soft" style={{ perspective: '400px' }}>
            music gallery
          </h1>

          <div ref={searchRef} className="flex flex-col md:flex-row gap-8 max-w-3xl mb-20">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="search for sonic experiences..."
              className="flex-1 py-5 px-1 border-0 border-b border-[rgba(255,255,255,0.08)] text-base bg-transparent text-[#f8f6f3] font-light tracking-[-0.01em] transition-all duration-[1200ms] ease-[cubic-bezier(0.19,1,0.22,1)] outline-none focus:border-[rgba(212,197,169,0.4)] placeholder:text-[rgba(248,246,243,0.25)] placeholder:font-extralight placeholder:tracking-wide"
            />
            <button
              onClick={handleSearch}
              className="py-5 px-10 border border-[rgba(255,255,255,0.08)] bg-transparent text-[rgba(248,246,243,0.6)] text-[10px] font-light tracking-[0.25em] uppercase cursor-pointer transition-all duration-[1000ms] ease-[cubic-bezier(0.19,1,0.22,1)] hover:text-[#f8f6f3] hover:border-[rgba(212,197,169,0.4)] hover:bg-[rgba(212,197,169,0.03)] active:transform-none backdrop-blur-sm"
            >
              search
            </button>
          </div>

          <div className="flex justify-start items-center">
            <div className="flex items-center gap-10">
              <label className="text-[10px] font-extralight tracking-[0.3em] uppercase text-[rgba(248,246,243,0.3)]">
                sort by
              </label>
              <select
                value={sortOption}
                onChange={(e) => handleSort(e.target.value as SortOption)}
                className="py-4 px-1 border-0 border-b border-[rgba(255,255,255,0.08)] bg-transparent text-[rgba(248,246,243,0.6)] text-[13px] font-light tracking-wide cursor-pointer transition-all duration-[1000ms] ease-[cubic-bezier(0.19,1,0.22,1)] outline-none min-w-[180px] hover:text-[#f8f6f3] hover:border-[rgba(212,197,169,0.3)] focus:text-[#f8f6f3] focus:border-[rgba(212,197,169,0.4)]"
              >
                <option value="default">default</option>
                <option value="title-asc">title (a-z)</option>
                <option value="title-desc">title (z-a)</option>
                <option value="artist-asc">artist (a-z)</option>
                <option value="artist-desc">artist (z-a)</option>
                <option value="duration-asc">duration (short)</option>
                <option value="duration-desc">duration (long)</option>
                <option value="random">shuffle</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      <main className="min-h-screen">
        {loading && <LoadingSpinner />}
        
        {error && (
          <div className="bg-transparent text-[rgba(248,246,243,0.4)] py-16 px-16 md:px-24 text-left text-sm font-extralight tracking-wide border-t border-[rgba(255,255,255,0.02)] animate-fadeIn">
            {error}
          </div>
        )}

        {!loading && !error && songs.length > 0 && (
          <div ref={gridRef} className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-[1px] p-0 bg-[rgba(255,255,255,0.015)]">
            {songs.map((song, index) => (
              <MusicCard key={song.id} song={song} index={index} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
