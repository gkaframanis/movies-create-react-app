import React, { useState } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";

function App() {
	const [movies, setMovies] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	const fetchMovieHandler = async () => {
		setIsLoading(true);
		// To clear any errors we might had.
		setError(null);
		try {
			// By default the method is get | gets as 2nd arg a js object if needed.
			const response = await fetch("https://swapi.dev/api/films/");
			// The response also has a "status" field which holds the concrete response status code.
			// We could also manually check that.
			if (!response.ok) {
				throw new Error("Something went wrong...");
			}

			const data = await response.json();

			const transformedMovies = data.results.map(movieData => {
				return {
					id: movieData.episode_id,
					title: movieData.title,
					openingText: movieData.opening_crawl,
					releaseDate: movieData.release_date,
				};
			});
			setMovies(transformedMovies);
		} catch (error) {
			setError(error.message);
		}
		setIsLoading(false);
	};

	// the jsx code for content outside the return function.
	let content = <p>Found no movies...</p>;

	if (movies.length > 0) {
		content = <MoviesList movies={movies} />;
	}

	if (error) {
		content = <p>{error}</p>;
	}

	if (isLoading) {
		content = <p>Loading...</p>;
	}

	return (
		<React.Fragment>
			<section>
				<button onClick={fetchMovieHandler}>Fetch Movies</button>
			</section>
			<section>{content}</section>
		</React.Fragment>
	);
}

export default App;
