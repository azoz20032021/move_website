import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./App.css";
import axios from "axios";
import Button from "@mui/joy/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";


const TOKEN = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMWVkYWUyMjMyMTUzZGYxYTMyMzQ4ZDQ2ZDliNDkwMiIsIm5iZiI6MTc1NTM4NjYxNS4yNDE5OTk5LCJzdWIiOiI2OGExMTJmNzlkMDJmOTc3ZTc2MzIyNWIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.HRz3aWh4jKsGN2JWkvo9pCAbA6u01d5v_ue6EEXEAAA";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function fetchMovies() {
      try {
        let url = "";

        if (query.trim()) {
          url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&language=en-US&page=${page}`;
        } else {
          url = `https://api.themoviedb.org/3/trending/movie/week?language=en-US&page=${page}`;
        }

        const res = await axios.get(url, {
          headers: {
            accept: "application/json",
            Authorization: TOKEN,
          },
        });
        
        const filtermovies = res.data.results.filter(movie => movie.adult  === false);
        setMovies(filtermovies);
        setTotalPages(res.data.total_pages || 1);
      } catch (err) {
        console.error("Axios error:", err);
      }
    }

    fetchMovies();
  }, [query, page]);
  return (
    <div className="app">
      <header className="header">
        <IconButton
  onClick={() => setMenuOpen(!menuOpen)}
  color="secondary"
  sx={{
    display: { xs: "block", md: "none" }, 
    position: "absolute",
    top: 2,
    left: 10,
    zIndex: 10,
    bgcolor: "white",
    color: "black",
    boxShadow: 1,
    "&:hover": {
      bgcolor: "primary",
      color: "black",
    },
  }}
>
  {menuOpen ? <CloseIcon /> : <MenuIcon />}
</IconButton>

        <nav className={`menu ${menuOpen ? "open" : ""}`}>
          <Link to="/" className="menu-item">
            Home
          </Link>
          <Link to="/Popular" className="menu-item">
            Popular
          </Link>
          <Link to="/Top" className="menu-item">
            Movies You May Like
          </Link>
        </nav>
        <div className="logo-title">
          <span className="logo" role="img" aria-label="logo">
            🎬
          </span>
          <span className="title-text">Movie App</span>
        </div>
      </header>

      <input
        type="text"
        className="search"
        placeholder="Search movies..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setPage(1); 
        }}
      />

      <div className="movie-grid">
        {movies.map((movie) => (
          <Link to={`/movie/${movie.id}`} key={movie.id} className="movie-card">
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

      <div className="pagination">
        <Button
          variant="solid" color="primary"
          disabled={page === 1}
          onClick={() => { setPage((prev) => prev - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        >
          ⬅ Previous
        </Button>

        <span>
          Page {page} of {totalPages}
        </span>

        <Button
        variant="solid" color="primary"
          disabled={page === totalPages}
          onClick={() => { setPage((prev) => prev + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        >
          Next ➡
        </Button>
      </div>
    </div>
    
  );
}
