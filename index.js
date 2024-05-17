console.log("Hello World!");

const API_KEY = "9626218391ae38329b6d11901b20a32e";

//Gets our referenses to the DOM-element.
const moviesContainer = document.getElementById("moviesContainer");
const searchForm = document.getElementById("searchForm");

//Adds eventlistener to our form
searchForm.addEventListener('submit', function (event) {
  event.preventDefault();


  const searchTerm = document.getElementById("search").value.trim();

  //Gets the matching css choice in our input where the attibute name is set to category wich is marked with checked
  const selectedCategory = document.querySelector('input[name="category"]:checked').value;
  let searchUrl;

  //If searchterm is empty and radio button movies or action is selected show top rated or popular
  if (searchTerm === '' && selectedCategory === "top_rated") {
    searchUrl = `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}`;

  }
  else if (searchTerm !== '' && selectedCategory === "top_rated") {
    console.log("Error, search need to be empty!");
    const errorMessage = document.createElement('div');
    errorMessage.classList.add('errorDiv');
    errorMessage.textContent = "Searchfield needs to be empty when searching for top rated movies!";
    moviesContainer.innerHTML = '';
    moviesContainer.appendChild(errorMessage);
  }
  else if (searchTerm !== '' && selectedCategory === "popular") {
    console.log("Error, search need to be empty!");
    const errorMessage = document.createElement('div');
    errorMessage.classList.add('errorDiv');
    errorMessage.textContent = "Searchfield needs to be empty when searching for popular movies!";
    moviesContainer.innerHTML = '';
    moviesContainer.appendChild(errorMessage);
  }
  else if (searchTerm === '' && selectedCategory === "popular") {
    searchUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`;

    //if a searchterm is put in and radio button is choosen, show the matching results
    
  } else {

    if (selectedCategory === "movies") {
      searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(searchTerm)}`;
    } else if (selectedCategory === "actors") {
      searchUrl = `https://api.themoviedb.org/3/search/person?api_key=${API_KEY}&query=${encodeURIComponent(searchTerm)}`;
    }
  }

  //We do a get-request to our url and convert the answer to json-format, if response is ok
  
  fetch(searchUrl)
    .then((res) => {
      if (!res.ok) {
        throw new Error('Network response was not ok');


      }
      return res.json();
    })

    .then((data) => {
      moviesContainer.innerHTML = '';

      //If there is no result error message will appear
      if (data.results.length === 0 && selectedCategory === "movies") {
        const errorMessage = document.createElement('div');
        errorMessage.classList.add('errorDiv');
        errorMessage.textContent = "No movies found matching the description!";
        moviesContainer.innerHTML = '';
        moviesContainer.appendChild(errorMessage);

      } else if (data.results.length === 0 && selectedCategory === "actors") {
        const errorMessage = document.createElement('div');
        errorMessage.classList.add('errorDiv');
        errorMessage.textContent = "No actors found matching the description!";
        moviesContainer.innerHTML = '';
        moviesContainer.appendChild(errorMessage);

      } else if (selectedCategory === "top_rated" || selectedCategory === "popular") {

        //Loops trough our movieobject from data results and creates a moviecard 
        data.results.slice(0, 10).forEach(media => {
          const ratedCard = createRatedCard(media); 
          moviesContainer.appendChild(ratedCard);
          console.log(data);
        });
      } else if (selectedCategory === "movies") {

        data.results.forEach(media => {
          const movieCard = createMovieCard(media);
          moviesContainer.appendChild(movieCard);
          console.log(data);

        });

      } else if (selectedCategory === "actors") {
        console.log(data.results);
        data.results.forEach(media => {
          const actorCard = createActorCard(media);
          moviesContainer.appendChild(actorCard);
          console.log(data);

        });

      }
    })
    //Catch for error handling
    .catch((err) => {
      console.log("Error fetching data:" + err);

      const errorMessage = document.createElement('div');
        errorMessage.classList.add('errorDiv');
        errorMessage.textContent = "There was an error fetching data!";
        moviesContainer.innerHTML = '';
        moviesContainer.appendChild(errorMessage);

    });



  //Function for movies that extracts title, pic, overview and release date,  creates the movie card in our div element

  function createMovieCard(media) {
    const { title, name, poster_path, overview, release_date } = media;

    const movieCard = document.createElement("div");
    movieCard.classList.add("movie_item")

    movieCard.innerHTML = `<img src="https://image.tmdb.org/t/p/w500${poster_path}" class="movie_img_rounded">
                          <h3>${title || name}</h3>
                          <div class = "overview">${overview}</div>
                          <h4>Release Date: ${release_date}</h4>
                          `;

    return movieCard;
  }

  //Function for actors that extracts title, pic and known for, creates the actor card in our div element

  function createActorCard(media) {
    const { name, known_for_department, profile_path, known_for } = media;

    const actorCard = document.createElement("div");
    actorCard.classList.add("actor_item")

    let knownForList = '';

    //if statment to check if item (known for) is movie or tv
    known_for.forEach(item => {
      if (item.title) {
        knownForList += `<p>Movie: ${item.title}</p>`;
      } else if (item.name) {
        knownForList += `<p>TV: ${item.name}</p>`;
      }
    });

    actorCard.innerHTML = `<img src="https://image.tmdb.org/t/p/w400/${profile_path}">
                          <h3>${name}</h3>
                          <p>${known_for_department}</p>
                          <h4>Known for: </h4>
                          <ul>${knownForList}</ul> 
                          `;//Gör en foreach loop och hämta ut arrayn
    return actorCard;
  }

  //Function for rated and popular movies, extracts title, pic, and release date

  function createRatedCard(media) {
    const { title, name, release_date, poster_path } = media;

    const ratedCard = document.createElement("div");
    ratedCard.classList.add("movie_item");

    ratedCard.innerHTML = `<img src="https://image.tmdb.org/t/p/w500${poster_path}" class="movie_img_rounded">
                          <h3>${title || name}</h3>
                          <h4>Release Date: ${release_date}</h4>
                          `;
    return ratedCard;

  }
});

