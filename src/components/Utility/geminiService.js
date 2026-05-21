import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.REACT_APP_API_KEY;
const TMDB_API_KEY = process.env.REACT_APP_TMDB_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

async function searchMovie(title) {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}`
    );
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      return data.results[0];
    }
    return null;
  } catch (error) {
    console.error('TMDB search error:', error);
    return null;
  }
}

export async function getMovieSuggestions(likedMovies) {
  if (!likedMovies || likedMovies.length === 0) {
    return [];
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
    
    const movieList = likedMovies.map(movie => 
      `- ${movie.movie_title} (Rating: ${movie.vote_average}/10)`
    ).join('\n');
    
    const prompt = `Based on these movies that a user likes:\n${movieList}\n\nSuggest 10 similar movies they might enjoy. Return ONLY a JSON array:\n[\n  {\n    "title": "Movie Title",\n    "reason": "Brief reason why they'd like it",\n    "genre": "Primary genre"\n  }\n]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const cleanedText = text.replace(/```json|```/g, '').trim();
    const suggestions = JSON.parse(cleanedText);
    
    const suggestionsWithPosters = await Promise.all(
      suggestions.map(async (suggestion) => {
        const movieData = await searchMovie(suggestion.title);
        return {
          ...suggestion,
          poster_path: movieData?.poster_path || null,
          vote_average: movieData?.vote_average || 0,
          id: movieData?.id || Math.random(),
          overview: movieData?.overview,
          genre_ids: movieData?.genre_ids || []
        };
      })
    );
    
    return suggestionsWithPosters;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return [];
  }
}