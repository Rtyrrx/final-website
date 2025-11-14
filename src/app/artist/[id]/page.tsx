import { getArtist, getArtistTopTracks, getArtistAlbums } from '@/lib/deezer-api';
import ArtistPage from '@/components/ArtistPage';
import { notFound } from 'next/navigation';

interface ArtistPageProps {
  params: Promise<{ id: string }>;
}

export default async function Artist({ params }: ArtistPageProps) {
  const { id } = await params;

  try {
    const [artist, tracks, albums] = await Promise.all([
      getArtist(id),
      getArtistTopTracks(id, 10),
      getArtistAlbums(id, 12)
    ]);

    return <ArtistPage artist={artist} tracks={tracks} albums={albums} />;
  } catch (error) {
    console.error('Error loading artist:', error);
    notFound();
  }
}
