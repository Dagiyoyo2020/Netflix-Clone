const API_BASE_URL = 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export async function getLikedMovies() {
  const response = await fetch(`${API_BASE_URL}/liked-movies`, {
    headers: getAuthHeaders()
  });
  
  if (!response.ok) throw new Error('Failed to fetch liked movies');
  return await response.json();
}

export async function likeMovie(movie) {
  const response = await fetch(`${API_BASE_URL}/liked-movies`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      movie_id: movie.id,
      movie_title: movie.title || movie.name,
      poster_path: movie.poster_path,
      vote_average: movie.vote_average,
      overview: movie.overview,
      genre_ids: movie.genre_ids || []
    })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }
  
  return await response.json();
}

export async function unlikeMovie(movieId) {
  const response = await fetch(`${API_BASE_URL}/liked-movies/${movieId}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  
  if (!response.ok) throw new Error('Failed to unlike movie');
  return await response.json();
}