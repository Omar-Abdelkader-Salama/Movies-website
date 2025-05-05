const global = {
  CurrentLocation: window.location.pathname,
};

async function displayPopularMovies() {
  const { results } = await fetchAPIData('movie/popular');
  results.forEach((movie) => {
    displayItem(movie, '#popular-movies', 'movies');
  });
}

async function displayPopularTvShows() {
  const { results } = await fetchAPIData('tv/popular');
  results.forEach((tvShows) => {
    displayItem(tvShows, '#popular-shows', 'tv-shows');
  });
}

function displayItem(item, htmlEndpoint, kind) {
  const card = document.createElement('div');
  card.classList.add('card');

  const link = document.createElement('a');
  link.href =
    kind === 'tv-shows'
      ? `tv-details.html?id=${item.id}`
      : `movie-details.html?id=${item.id}`;

  const img = document.createElement('img');
  img.src = item.poster_path
    ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
    : 'images/no-image.jpg';
  img.classList.add('card-img-top');
  img.alt = item.title ? item.title : item.name;

  link.appendChild(img);
  card.appendChild(link);

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');

  const cardTitle = document.createElement('h5');
  cardTitle.classList.add('card-title');
  cardTitle.textContent = item.title ? item.title : item.name;

  const cardText = document.createElement('p');
  cardText.classList.add('card-text');

  const smallText = document.createElement('small');
  smallText.classList.add('text-muted');
  smallText.textContent = item.release_date
    ? `Release: ${item.release_date || 'N/A'}`
    : `Aired: ${item.first_air_date || 'N/A'}`;

  cardText.appendChild(smallText);
  cardBody.appendChild(cardTitle);
  cardBody.appendChild(cardText);
  card.appendChild(cardBody);

  document.querySelector(htmlEndpoint).appendChild(card);
}


async function displayTvShowsDetails(){
  const showID = window.location.search.split('=')[1] ;
  const TvShow = await fetchAPIData(`tv/${showID}`)
  document.getElementById('show-details').innerHTML = 
  `
  <div class="details-top">
          <div>
            <img
              src="${
                TvShow.poster_path
                  ? `https://image.tmdb.org/t/p/w500${TvShow.poster_path}`
                  : 'images/no-image.jpg'
              }"
              class="card-img-top"
              alt="${TvShow.name}"
            />
          </div>
          <div>
            <h2>${TvShow.name}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${TvShow.vote_average} / 10
            </p>
            <p class="text-muted">First Air Date: ${
              TvShow.first_air_date || 'N/A'
            }</p>
            <p>${TvShow.overview || 'No description available.'}</p>
            <h5>Genres</h5>
            <ul class="list-group">
              ${TvShow.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
            </ul>
            <a href="${
              TvShow.homepage || '#'
            }" target="_blank" class="btn">Visit Show Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Show Info</h2>
          <ul>
            <li><span class="text-secondary">Number Of Episodes:</span> ${
              TvShow.number_of_episodes || 'N/A'
            }</li>
            <li>
              <span class="text-secondary">Last Episode To Air:</span> ${
                TvShow.last_episode_to_air
                  ? TvShow.last_episode_to_air.name
                  : 'N/A'
              }
            </li>
            <li><span class="text-secondary">Status:</span> ${
              TvShow.status || 'N/A'
            }</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">
            ${
              TvShow.production_companies
                .map((company) => `<span>${company.name}</span>`)
                .join(', ') || 'N/A'
            }
          </div>
        </div>
  `;
  displayBackgroundImage('show' , `https://image.tmdb.org/t/p/w500${TvShow.backdrop_path}`)
}


async function displayMovieDetails() {
  movieID = window.location.search.split('=')[1];
  movie = await fetchAPIData(`movie/${movieID}`);;

  document.getElementById('movie-details').innerHTML = `
  <div class="details-top">
          <div>
            <img
              src="${
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : 'images/no-image.jpg'
              }"
              class="card-img-top"
              alt="${movie.title}"
            />
          </div>
          <div>
            <h2>${movie.title}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${movie.vote_average} / 10
            </p>
            <p class="text-muted">Release Date: ${
              movie.release_date || 'N/A'
            }</p>
            <p>${movie.overview || 'No description available.'}</p>
            <h5>Genres</h5>
            <ul class="list-group">
              ${movie.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
            </ul>
            <a href="${
              movie.homepage || '#'
            }" target="_blank" class="btn">Visit Movie Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Movie Info</h2>
          <ul>
            <li><span class="text-secondary">Budget:</span> $${
              movie.budget.toLocaleString() || 'N/A'
            }</li>
            <li><span class="text-secondary">Revenue:</span> $${
              movie.revenue.toLocaleString() || 'N/A'
            }</li>
            <li><span class="text-secondary">Runtime:</span> ${
              movie.runtime || 'N/A'
            } minutes</li>
            <li><span class="text-secondary">Status:</span> ${
              movie.status || 'N/A'
            }</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">
            ${
              movie.production_companies
                .map((company) => `<span>${company.name}</span>`)
                .join(', ') || 'N/A'
            }
          </div>
        </div>
  `;

  displayBackgroundImage(
    'movie',
    `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`
  );
}

async function fetchAPIData(endpoint) {
  const API_KEY = 'fbef5161f520483fb09d156e4573dc12';
  const api_URL = 'https://api.themoviedb.org/3/';

  showSpinner();

  const res = await fetch(
    `${api_URL + endpoint}?api_key=${API_KEY}&language=en-US`
  );

  const data = await res.json();

  hideSpinner();

  return data;
}

function showSpinner() {
  document.querySelector('.spinner').classList.add('show');
}

function hideSpinner() {
  document.querySelector('.spinner').classList.remove('show');
}

//Highlight active link

function highLight() {
  if (
    global.CurrentLocation === '/' ||
    global.CurrentLocation === '/index.html'
  ) {
    document.querySelectorAll('a').forEach((e) => e.classList.remove('active'));
    document.querySelector('nav [href="/"]').classList.add('active');
  } else if (global.CurrentLocation === '/shows.html') {
    document.querySelectorAll('a').forEach((e) => e.classList.remove('active'));
    document.querySelector('nav [href="/shows.html"]').classList.add('active');
  }
}

function displayBackgroundImage(type, url) {
  const overlay = document.createElement('div');
  overlay.style.backgroundImage = `url(${url})`;
  overlay.classList.add('details_backdrop')

  if (type === 'movie') {
    document.querySelector('#movie-details').appendChild(overlay); 
  } else {
    document.querySelector('#show-details').appendChild(overlay);
  }
}

//App Router
function init() {
  switch (global.CurrentLocation) {
    case '/':
    case '/index.html':
      displayPopularMovies();
      break;
    case '/shows.html':
      displayPopularTvShows();

      break;
    case '/movie-details.html':
      displayMovieDetails();
      break;
    case '/tv-details.html':
      displayTvShowsDetails();
      break;
    case 'search.html':
      console.log('Search page');
      break;
  }
  highLight();
}

init();
