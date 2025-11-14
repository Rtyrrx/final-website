export interface Artist {
  id: number;
  name: string;
  picture: string;
  picture_small: string;
  picture_medium: string;
  picture_big: string;
  picture_xl: string;
  nb_album?: number;
  nb_fan?: number;
  tracklist?: string;
}

export interface Album {
  id: number;
  title: string;
  cover: string;
  cover_small: string;
  cover_medium: string;
  cover_big: string;
  cover_xl: string;
  release_date?: string;
  tracklist?: string;
}

export interface Track {
  id: number;
  title: string;
  duration: number;
  preview: string;
  artist: Artist;
  album: Album;
  rank?: number;
}

export interface DeezerResponse<T> {
  data: T[];
  total?: number;
  next?: string;
}

export interface GenreArtistsResponse {
  data: Artist[];
}

export type SortOption = 
  | 'default' 
  | 'title-asc' 
  | 'title-desc' 
  | 'artist-asc' 
  | 'artist-desc' 
  | 'duration-asc' 
  | 'duration-desc' 
  | 'random';
