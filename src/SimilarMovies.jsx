import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const TOKEN =
  "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMWVkYWUyMjMyMTUzZGYxYTMyMzQ4ZDQ2ZDliNDkwMiIsIm5iZiI6MTc1NTM4NjYxNS4yNDE5OTk5LCJzdWIiOiI2OGExMTJmNzlkMDJmOTc3ZTc2MzIyNWIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.HRz3aWh4jKsGN2JWkvo9pCAbA6u01d5v_ue6EEXEAAA";

export default function SimilarMovies({ movieId }) {
  const [similar, setSimilar] = useState([]);
  

  useEffect(() => {
    async function fetchSimilar() {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}/similar`,
          {
            headers: { accept: "application/json", Authorization: TOKEN },
          }
        );
        if (res.ok) {
          const data = await res.json();
          const filtered = data.results.filter((m) => m.adult === false);
          setSimilar(filtered);
        }
      } catch (e) {
        console.error("Error fetching similar movies:", e);
      }
    }
    fetchSimilar();
  }, [movieId]);

  if (!similar.length) return null;

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 3,
    autoplay: true,
    autoplaySpeed: 2900,
    pauseOnHover: true,
    arrows: true,
    adaptiveHeight: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 4, slidesToScroll: 2 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 3, slidesToScroll: 1 },
      },
      {
        breakpoint: 480,
        // on very small screens show 3 larger rectangular posters
        settings: { slidesToShow: 3, slidesToScroll: 1, arrows: true, autoplay: false },
      },
    ],
  };

  return (
    <div className="similar-section">
      <h2>Similar Movies</h2>
      <Slider {...settings} className="similar-slider">
        {similar.map((m) => (
          <div key={m.id} className="similar-card">
            <Link to={`/movie/${m.id}`}>
              <img
                className="similar-poster"
                src={
                  m.poster_path
                    ? `https://image.tmdb.org/t/p/w300${m.poster_path}`
                    : `https://via.placeholder.com/300x450?text=No+Image`
                }
                alt={m.title || 'Similar movie'}
              />
              <p className="similar-title">{m.title}</p>
            </Link>
          </div>
        ))}
      </Slider>
    </div>
  );
}
