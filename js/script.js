const global = {
  CurrentLocation: window.location.pathname,
};

async function displayPopularMovies() {
  const {results} = await fetchAPIData('movie/popular');
  results.forEach((movie) => {
    const card = document.createElement('div');
    card.classList.add('card');

    const link = document.createElement('a');
    link.href = `movie-details.html?id=${movie.id}`;

    const img = document.createElement('img');
    img.src = movie.poster_path 
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
        : 'images/no-image.jpg';
    img.classList.add('card-img-top');
    img.alt = movie.title;

    link.appendChild(img);
    card.appendChild(link);

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    const cardTitle = document.createElement('h5');
    cardTitle.classList.add('card-title');
    cardTitle.textContent = movie.title;

    const cardText = document.createElement('p');
    cardText.classList.add('card-text');

    const smallText = document.createElement('small');
    smallText.classList.add('text-muted');
    smallText.textContent = `Release: ${movie.release_date || 'N/A'}`;

    cardText.appendChild(smallText);
    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardText);
    card.appendChild(cardBody);

    document.querySelector('#popular-movies').appendChild(card);
  })
}

async function fetchAPIData(endpoint) {
  const API_KEY = 'fbef5161f520483fb09d156e4573dc12';
  const api_URL = 'https://api.themoviedb.org/3/';

  const res = await fetch(
    `${api_URL + endpoint}?api_key=${API_KEY}&language=en-US`
  );
  const data = await res.json();

  return data;
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

//App Router
function init() {
  switch (global.CurrentLocation) {
    case '/':
    case '/index.html':
      displayPopularMovies();
      break;
    case '/shows.html':
      console.log('shows');
      break;
    case '/movie-details.html':
      console.log('movie details');
      break;
    case '/tv-details.html':
      console.log('tv-shows details');
      break;
    case 'search.html':
      console.log('Search page');
      break;
  }
  highLight();
}

init();
