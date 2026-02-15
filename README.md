# Movies Page

Prosta aplikacja w `Next.js` do przeglądania filmów, seriali i osób z bazy TMDB.

## Wymagania

- Node.js 18+
- zmienna środowiskowa `TMDB_API_KEY` (token Bearer do TMDB API v3/v4)

Przykład `.env.local`:

```env
TMDB_API_KEY=your_tmdb_bearer_token
```

## Uruchomienie

```bash
npm install
npm run dev
```

Aplikacja domyślnie działa pod `http://localhost:3000`.

## Użyte API i endpointy

Projekt korzysta z zewnętrznego API: **The Movie Database (TMDB)**  
Base URL: `https://api.themoviedb.org/3`

### Wewnętrzny endpoint aplikacji

- `GET /api/search?type=movie|tv|person&query=<tekst>&page=<nr>`
  - endpoint pośredniczący do wyszukiwania w TMDB

### Endpointy TMDB używane w projekcie

- Wyszukiwanie:
  - `/search/movie`
  - `/search/tv`
  - `/search/person`
- Filmy:
  - `/movie/now_playing`
  - `/movie/popular`
  - `/movie/top_rated`
  - `/movie/upcoming`
  - `/movie/{movieId}`
  - `/movie/{movieId}/credits`
  - `/movie/{movieId}/videos`
  - `/movie/{movieId}/images`
  - `/movie/{movieId}/recommendations`
  - `/movie/{movieId}/reviews`
- Seriale:
  - `/tv/airing_today`
  - `/tv/on_the_air`
  - `/tv/popular`
  - `/tv/top_rated`
  - `/tv/{seriesId}`
  - `/tv/{seriesId}/credits`
  - `/tv/{seriesId}/videos`
  - `/tv/{seriesId}/images`
  - `/tv/{seriesId}/recommendations`
  - `/tv/{seriesId}/similar`
  - `/tv/{seriesId}/reviews`
- Osoby:
  - `/person/{personId}`
  - `/person/{personId}/images`
  - `/person/{personId}/movie_credits`
  - `/person/{personId}/tv_credits`
  - `/person/{personId}/combined_credits`

### Grafiki

Obrazy pobierane są z TMDB CDN:

- `https://image.tmdb.org/t/p/...`

## Dostępne strony (trasy)

- `/` - strona główna
- `/movies` - listy filmów
- `/movies/[movieId]` - szczegóły filmu
- `/movies/[movieId]/credits` - obsada i twórcy filmu
- `/movies/[movieId]/reviews` - recenzje filmu
- `/series` - listy seriali
- `/series/[seriesId]` - szczegóły serialu
- `/series/[seriesId]/credits` - obsada i twórcy serialu
- `/series/[seriesId]/reviews` - recenzje serialu
- `/people/[personId]` - szczegóły osoby (aktor/reżyser itp.)
