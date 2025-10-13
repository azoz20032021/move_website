import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import SimilarMovies from "./SimilarMovies";
import "./App.css";
import ShareIcon from '@mui/icons-material/Share';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

const TOKEN =
  "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMWVkYWUyMjMyMTUzZGYxYTMyMzQ4ZDQ2ZDliNDkwMiIsIm5iZiI6MTc1NTM4NjYxNS4yNDE5OTk5LCJzdWIiOiI2OGExMTJmNzlkMDJmOTc3ZTc2MzIyNWIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.HRz3aWh4jKsGN2JWkvo9pCAbA6u01d5v_ue6EEXEAAA";

export default function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [videoKey, setVideoKey] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [err, setErr] = useState("");
  const [saved, setSaved] = useState(false);
  const [liked, setLiked] = useState(false);
  const [director, setDirector] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setErr("");
        setMovie(null);
        setVideoKey(null);

        const movieRes = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?language=en-US`,
          {
            headers: { accept: "application/json", Authorization: TOKEN },
          }
        );
        if (!movieRes.ok) throw new Error(`HTTP ${movieRes.status}`);
        const movieData = await movieRes.json();
        setMovie(movieData);

        const videoRes = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`,
          {
            headers: { accept: "application/json", Authorization: TOKEN },
          }
        );
        if (videoRes.ok) {
          const videoData = await videoRes.json();
          const yt = videoData.results.find(
            (v) => v.site === "YouTube" && v.type === "Trailer"
          );
          if (yt) setVideoKey(yt.key);
        }
        try {
          const creditsRes = await fetch(`https://api.themoviedb.org/3/movie/${id}/credits`, {
            headers: { accept: "application/json", Authorization: TOKEN },
          });
          if (creditsRes.ok) {
            const creditsData = await creditsRes.json();
            const dir = creditsData.crew?.find((c) => c.job === "Director");
            if (dir) setDirector(dir.name);
          }
        } catch (err) {
          console.warn('Credits fetch failed', err);
        }
      } catch (e) {
        setErr(String(e));
      }
    }

    fetchData();
  }, [id]);

  if (err)
    return (
      <div className="details">
        <p>❌ {err}</p>
        <Link to="/">⬅ Back</Link>
      </div>
    );

  if (!movie)
    return (
      <div className="details">
        <p>Loading…</p>
      </div>
    );

  // 🎥 YouTube links
  const youtubeLink = videoKey
    ? `https://www.youtube.com/watch?v=${videoKey}`
    : null;
  const youtubeThumbnail = videoKey
    ? `https://img.youtube.com/vi/${videoKey}/hqdefault.jpg`
    : null;

  return (
    <div className="details">
      <Link to="/">⬅ Back</Link>

      <div className="details-layout">
        {/* Left column: poster / video */}
        <div>
          {youtubeThumbnail ? (
            <div className="video-wrap">
              {!playing ? (
                <>
                  <a href={youtubeLink} target="_blank" rel="noopener noreferrer">
                    <img
                      className="details-poster"
                      src={youtubeThumbnail}
                      alt={`${movie.title} Trailer`}
                    />
                  </a>
                  <button
                    type="button"
                    className="play-overlay"
                    aria-label="Play trailer"
                    onClick={(e) => { e.stopPropagation(); setPlaying(true); }}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setPlaying(true); } }}
                  >
                    <svg className="start" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                      <path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445"/>
                    </svg>
                  </button>
                </>
              ) : (
                <div className="iframe-wrap">
                  <iframe
                    title={`${movie.title} trailer`}
                    src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}
            </div>
          ) : (
            movie.poster_path && (
              <img
                className="details-poster"
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
              />
            )
          )}
        </div>

        <div className="details-info">
          <h1>{movie.title}</h1>
          <p><strong>Release:</strong> {movie.release_date || "N/A"}</p>
          <p>
            <strong>Rating:</strong> {movie.vote_average?.toFixed(1) ?? "N/A"}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-star" viewBox="0 0 16 16">
              <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z"/>
            </svg>
          </p>

          <p className="overview">{movie.overview}</p>

          <div className="icons">
            <div className="icon-group" onClick={() => setLiked(!liked)} style={{ cursor: "pointer", display: 'inline-block', marginRight: 12 }}>
              {liked ? (<FavoriteIcon color="primary"/>) : (<FavoriteBorderIcon color="primary" />)}
            </div>
            <ShareIcon className="share-icon" color="action" style={{ verticalAlign: 'middle', marginRight: 12 }} />
            <div onClick={() => setSaved(!saved)} style={{ cursor: "pointer", display: 'inline-block' }}>
              {saved ? (<BookmarkIcon color="primary" className="bookmark-icon" />) : (<BookmarkBorderIcon color="primary" className="bookmark-icon" />)}
            </div>
          </div>
          <div className="details-meta">
            <p className="meta-item"><strong>Director:</strong> {director || 'N/A'}</p>
            <p className="meta-item">
              <strong>Genres:</strong>
              {movie.genres && movie.genres.length > 0 ? (
                <span className="genre-list">
                  {movie.genres.map((g) => (
                    <span key={g.id || g.name} className="genre-badge">{g.name}</span>
                  ))}
                </span>
              ) : (
                ' N/A'
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="similar-container">
        <SimilarMovies movieId={id} />
      </div>
    </div>
  );
}
