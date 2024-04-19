console.log("Hello World!");

const API_KEY = "9626218391ae38329b6d11901b20a32e";

const url = `https://api.themoviedb.org/3/trending/all/week?api_key=${API_KEY}`;

//Gets our referenses to the DOM-element.
const moviesContainer = document.getElementById("movies");
const searchForm = document.getElementById("searchForm");

//Adds eventlistener to our form
searchForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const searchTerm = document.getElementById("search").value.trim();
  //If searchterm is not empty sends a request to the tmdb API
  if (searchTerm !== '') {
    const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(searchTerm)}`;

    //We do a get-request to our url and convert the answer to json-format
    fetch(searchUrl)
      .then((res) => res.json())
      .then((data) => {
        //console.log(json))
        moviesContainer.innerHTML = '';

        //Loops trough our filmobject from data results and creates a moviecard which we put in our movieconatiner
        data.results.forEach(media => {
          const movieCard = createMovieCard(media);
          moviesContainer.appendChild(movieCard);

        });
      })
      .catch((err) => console.error("error:" + err));
  }
});

//
async function fetchMovies() {
  try {
    const response = await fetch(searchUrl);
    const data = await response.json();

    data.results.forEach(media => {
      const movieCard = createMovieCard(media);
      moviesContainer.appendChild(movieCard);
    });
  } catch (error) {
    console.log("Error fetching data: ", error);
  }

}


function createMovieCard(media) {
  const { title, name, backdrop_path } = media;

  const movieCard = document.createElement("div");
  movieCard.classList.add("movie_item")

  movieCard.innerHTML = `<img src="https://image.tmdb.org/t/p/w500${backdrop_path}" class="movie_img_rounded">
                          <div class = "title">${title || name}</div>`;
  return movieCard;
}

fetchMovies();
