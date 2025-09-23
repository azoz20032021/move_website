import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./App.css";

const TOKEN =
  "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMWVkYWUyMjMyMTUzZGYxYTMyMzQ4ZDQ2ZDliNDkwMiIsIm5iZiI6MTc1NTM4NjYxNS4yNDE5OTk5LCJzdWIiOiI2OGExMTJmNzlkMDJmOTc3ZTc2MzIyNWIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.HRz3aWh4jKsGN2JWkvo9pCAbA6u01d5v_ue6EEXEAAA"; // <-- same token as in Home.jsx

export default function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    setErr("");
    setMovie(null);

    fetch(`https://api.themoviedb.org/3/movie/${id}?language=en-US`, {
      headers: {
        accept: "application/json",
        Authorization: TOKEN,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => setMovie(data))
      .catch((e) => setErr(String(e)));
  }, [id]);

  if (err) return <div className="details"><p>❌ {err}</p><Link to="/">⬅ Back</Link></div>;
  if (!movie) return <div className="details"><p>Loading…</p></div>;

  return (
    <div className="details">
      <Link to="/" className="back">⬅ Back</Link>

      <div className="details-layout">
        {movie.poster_path && (
          <img
            className="details-poster"
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
          />
        )}

        <div className="details-info">
          <h1>{movie.title}</h1>
          <p><strong>Release:</strong> {movie.release_date || "N/A"}</p>
          <p><strong>Rating:</strong> {movie.vote_average?.toFixed(1) ?? "N/A"}</p>
          <p className="overview">{movie.overview}</p>
        </div>
      </div>
    </div>
  );
}
