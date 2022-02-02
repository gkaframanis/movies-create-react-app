import React, { useState, useEffect, useCallback } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";
import AddMovie from "./components/AddMovie";

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
			const response = await fetch("https://starwars-movies-react-app-default-rtdb.firebaseio.com/movies.json");
			// The response also has a "status" field which holds the concrete response status code.
			// We could also manually check that.
			if (!response.ok) {
				throw new Error("Something went wrong...");
			}

			const data = await response.json();

			const loadedMovies = [];

			for (const key in data) {
				loadedMovies.push({
					id: key,
					title: data[key].title,
					openingText: data[key].openingText,
					releaseDate: data[key].releaseDate,
				});
			}

			setMovies(loadedMovies);
		} catch (error) {
			setError(error.message);
		}
		setIsLoading(false);
	}, []);

	// Runs only when it loads for the first time.
	useEffect(() => {
		fetchMoviesHandler();
	}, [fetchMoviesHandler]);

	const addMovieHandler = async movie => {
		const response = await fetch("https://starwars-movies-react-app-default-rtdb.firebaseio.com/movies.json", {
			method: "POST",
			// Turn the object to JSON format.
			body: JSON.stringify(movie),
			headers: {
				"Content-Type": "application/json",
			},
		});
		const data = await response.json();
		console.log(data);
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
				<AddMovie onAddMovie={addMovieHandler} />
			</section>
			<section>
				<button onClick={fetchMoviesHandler}>Fetch Movies</button>
			</section>
			<section>{content}</section>
		</React.Fragment>
	);
}

export default App;
