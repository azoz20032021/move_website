import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./App.css";

const TOKEN = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMWVkYWUyMjMyMTUzZGYxYTMyMzQ4ZDQ2ZDliNDkwMiIsIm5iZiI6MTc1NTM4NjYxNS4yNDE5OTk5LCJzdWIiOiI2OGExMTJmNzlkMDJmOTc3ZTc2MzIyNWIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.HRz3aWh4jKsGN2JWkvo9pCAbA6u01d5v_ue6EEXEAAA"; // <-- replace with your long eyJ... token

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetch("https://api.themoviedb.org/3/trending/movie/week?language=en-US", {
      headers: {
        accept: "application/json",
        Authorization: TOKEN,
      },
    })
      .then((res) => res.json())
      .then((data) => setMovies(data.results || []))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  const filtered = movies.filter((m) =>
    (m.title || "").toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="app">
      <header className="header">
        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
        <nav className={`menu ${menuOpen ? "open" : ""}`}>
          <Link to="/" className="menu-item">Home</Link>
          <Link to="/movies" className="menu-item">Movies</Link>
          <Link to="/may-like" className="menu-item">Movies May You Like</Link>
        </nav>
        <div className="logo-title">
          <span className="logo" role="img" aria-label="logo">🎬</span>
          <span className="title-text">Movie App</span>
        </div>
      </header>

      <input
        type="text"
        className="search"
        placeholder="Search movies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="movie-grid">
        {filtered.map((movie) => (
          <Link
            to={`/movie/${movie.id}`}
            key={movie.id}
            className="movie-card" 
          >
            <div className="poster">
              {movie.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                />
              ) : (
                <div className="no-poster">{(movie.title || "?")[0]}</div>
              )}
            </div>
            <div className="info">
              <h2>{movie.title}</h2>
              <p>{movie.release_date?.slice(0, 4) || "N/A"}</p>
              <span className="rating">
                ⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
