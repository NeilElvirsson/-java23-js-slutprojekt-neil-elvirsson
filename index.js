console.log("Hello World!");

const API_KEY = "9626218391ae38329b6d11901b20a32e";

//const url = `https://api.themoviedb.org/3/trending/all/week?api_key=${API_KEY}`;

//Gets our referenses to the DOM-element.
const moviesContainer = document.getElementById("moviesContainer");
const searchForm = document.getElementById("searchForm");

//Adds eventlistener to our form
searchForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const searchTerm = document.getElementById("search").value.trim();
  const selectedCategory = document.querySelector('input[name="category"]:checked').value;
  let searchUrl;



  //If searchterm is empty and radio button movies or action is selected show trending
  if (searchTerm === '' && selectedCategory === "movies") {
    searchUrl = `https://api.themoviedb.org/3//movie/top_rated?api_key=${API_KEY}`;
  }
    else if (searchTerm === '' && selectedCategory === "tv_shows") {
      searchUrl = `https://api.themoviedb.org/3/trending/tv/week?api_key=${API_KEY}`;
    
      //Else if a searchterm is put in and radio button is choosen, show the matching results
  } else {

    if (selectedCategory === "movies") {
      searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(searchTerm)}`;
    } else if (selectedCategory === "tv_shows") {
      searchUrl = `https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(searchTerm)}`;
    } else if (selectedCategory === "actors") {
      searchUrl = `https://api.themoviedb.org/3/search/person?api_key=${API_KEY}&query=${encodeURIComponent(searchTerm)}`;
    }
  }


  //We do a get-request to our url and convert the answer to json-format
  fetch(searchUrl)
    .then((res) => res.json())
    .then((data) => {

      const topRatedMovies = data.results.slice(0, 10);

      //console.log(json))
      moviesContainer.innerHTML = '';

      //Loops trough our movieobject from data results and creates a moviecard which we put in our movieconatiner
      //If there is no result error message will appear
      if (data.results.length === 0) {
        const errorMessage = document.createElement('div');
        errorMessage.textContent = "No movie found matching the description!";
        moviesContainer.appendChild(errorMessage);

      } else {

        data.results.forEach(media => {
          const movieCard = createMovieCard(media);
          moviesContainer.appendChild(movieCard);
          console.log(data);
        });
      }
    })
    .catch((err) => console.error("error:" + err));



  //If no searchTerm is written error message will appear
  const errorMessage = document.createElement('div');
  errorMessage.textContent = "An error occurred!";
  moviesContainer.appendChild(errorMessage);

if (searchTerm === '') {
  const errorMessage = document.createElement('div');
  errorMessage.textContent = "Please enter a movie to search for";
  moviesContainer.appendChild(errorMessage);
}

});

//Function that extracts title, creates the movie card in our div element,
// adds css style and returns the movie card element
function createMovieCard(media) {
  const { title, name, backdrop_path, overview, release_date } = media;

  const movieCard = document.createElement("div");
  movieCard.classList.add("movie_item")

  movieCard.innerHTML = `<img src="https://image.tmdb.org/t/p/w500${backdrop_path}" class="movie_img_rounded">
                          <h3>${title || name}</h3>
                          <div class = "overview">${overview}</div>
                          <h4>Release Date: ${release_date}</h4>
                          `;

  return movieCard;
}

//Not using this function for now
/*
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
*/
//fetchMovies();
