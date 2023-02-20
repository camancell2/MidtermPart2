// Locally storing this so we don't have to request the api every single time
const apiKey = 'YOUR_API_KEY';

const movieResults = [];

const genreMap = [
    {id: 28, name: 'Action'},
    {id: 12, name: 'Adventure'},
    {id: 16, name: 'Animation'},
    {id: 35, name: 'Comedy'},
    {id: 80, name: 'Crime'},
    {id: 99, name: 'Documentary'},
    {id: 18, name: 'Drama'},
    {id: 10751, name: 'Family'},
    {id: 14, name: 'Fantasy'},
    {id: 36, name: 'History'},
    {id: 27, name: 'Horror'},
    {id: 10402, name: 'Music'},
    {id: 9648, name: 'Mystery'},
    {id: 10749, name: 'Romance'},
    {id: 878, name: 'Science Fiction'},
    {id: 10770, name: 'TV Movie'},
    {id: 53, name: 'Thriller'},
    {id: 10752, name: 'War'},
    {id: 37, name: 'Western'}
];

// Responsible for converting the given genre ids to the correct name
function convertIdToGenre(genreIds) {
    var result = [];

    for (genre of genreMap) {
        if (genreIds.includes(genre.id)) {
            result.push(genre.name);
        }
    }

    return result;
}

function generateUi(movieResults) {
    let movieSection = document.getElementById('movie-section');

    movieResults.forEach((movieObject) => {
        let imageContainer = document.createElement('div');

        imageContainer.innerHTML = 
        `<img src=${movieObject['posterImage']}>
        <b>${movieObject['movieTitle']}</b> 
        <p>${movieObject['movieDesc']}</p> 
        <p>${movieObject['genres'].join(', ')}<p> 
        <time>${movieObject['releaseDate']}</time>`

        movieSection.appendChild(imageContainer);
    })
}

function search() {
    const searchQuery = document.getElementById('searchQuery').value;

    fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${searchQuery}`)
    .then((response) => response.json())
    .then((data) => {
        results = data['results'];
        resultsCount = data['total_results'];

        console.log(results);

        // Needed
        // 1. Image of the movie
        // 2. Title of the movie
        // 3. Released Year
        // 4. Description
        // 5. Genre(s)

        if (resultsCount > 0) {
            // limiting to 10 results
            var maxCount = 10;

            for (result of results)
            {
                posterImagePath = result['poster_path'];
                backdropPath = result['backdrop_path'];
                posterImage = `https://image.tmdb.org/t/p/original${posterImagePath}`;
                movieTitle = result['title'];
                movieDesc = result['overview'];
                genres = convertIdToGenre(result['genre_ids']);
                releaseDate = new Date(result['release_date']).toDateString();

                // Assume the data is valid
                if (backdropPath !== null)
                    movieResults.push({movieTitle, movieDesc, posterImage, genres, releaseDate});

                if (maxCount == 1)
                    break;

                maxCount--;
            }
        } else {
            return;
        }

        generateUi(movieResults);
    });
}