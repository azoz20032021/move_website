import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./App.css";

const TOKEN =
  "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMWVkYWUyMjMyMTUzZGYxYTMyMzQ4ZDQ2ZDliNDkwMiIsIm5iZiI6MTc1NTM4NjYxNS4yNDE5OTk5LCJzdWIiOiI2OGExMTJmNzlkMDJmOTc3ZTc2MzIyNWIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.HRz3aWh4jKsGN2JWkvo9pCAbA6u01d5v_ue6EEXEAAA";

export default function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [videoKey, setVideoKey] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        setErr("");
        setMovie(null);
        setVideoKey(null);

        // 1️⃣ Fetch movie info
        const movieRes = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?language=en-US`,
          {
            headers: { accept: "application/json", Authorization: TOKEN },
          }
        );
        if (!movieRes.ok) throw new Error(`HTTP ${movieRes.status}`);
        const movieData = await movieRes.json();
        setMovie(movieData);

        // 2️⃣ Fetch YouTube trailer info
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
        {youtubeThumbnail ? (
          <a href={youtubeLink} target="_blank" rel="noopener noreferrer">
            <img
              className="details-poster"
              src={youtubeThumbnail}
              alt={`${movie.title} Trailer`}
            />
            <svg className="start" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
              <path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445"/>
</svg>
          </a>
        ) : (
          movie.poster_path && (
            <img
              className="details-poster"
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
            />
          )
        )}

        <div className="details-info">
          <h1>{movie.title}</h1>
          <p><strong>Release:</strong> {movie.release_date || "N/A"}</p>
          <p><strong>Rating:</strong> {movie.vote_average?.toFixed(1) ?? "N/A"}  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star" viewBox="0 0 16 16">
  <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z"/>
</svg></p>
          <p className="overview">{movie.overview}</p>
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart" viewBox="0 0 16 16">
  <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15"/>
</svg>
        </div>
        
      </div>
    </div>
  );
}
