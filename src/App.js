import React, { useState, useEffect, useCallback } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";

function App() {
	const [movies, setMovies] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	// Using useCallback() so the useEffect() doesn't fall in a infinite loop, since in every rerender
	// the pointer to the function changes!!!
	const fetchMoviesHandler = useCallback(async () => {
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
	}, []);

	// Runs only when it loads for the first time.
	useEffect(() => {
		fetchMoviesHandler();
	}, [fetchMoviesHandler]);

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
				<button onClick={fetchMoviesHandler}>Fetch Movies</button>
			</section>
			<section>{content}</section>
		</React.Fragment>
	);
}

export default App;
