const API_KEY = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiNDVjZGRmZWVhNjQ0NTkzZTU3M2FkODliNzQyYzU0OSIsIm5iZiI6MTY0Nzc1NzM5My4wOTQsInN1YiI6IjYyMzZjODUxODk0ZWQ2MDAxYzllZDViOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Th-GXhrpU7qTH2n_-VJ7ZX-kDeN6FDZpdDnQ7V_AWLI"

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
};

const movieList = document.querySelector('#card_container');
const searchBtn = document.querySelector('#searchBtn');

//인기있는 영화 리스트 가져오기
const getPopularList = async () => {
  try{
    const res = await fetch('https://api.themoviedb.org/3/movie/popular?language=en-US&page=1', options);
    const data = await res.json();
    // console.log(data.results)
    // console.log(`data: ${JSON.stringify(data,null,4)}`);
    return data;
  }catch(e){
    console.error(e);
  }
}


const popularFunc = async () => {
  const popularList = await getPopularList();
  //console.log(`popularList: ${JSON.stringify(popularList,null,4)}`);
  popularList.results.forEach((movie) => {
    const card = makeMovieList(movie);
    movieList.appendChild(card);
  });
  
}

//카드 생성 메서드
function makeMovieList(movie){
  console.log(`makemovielist data: ${movie}`);
  const cardDiv = document.createElement('div');
  cardDiv.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}"  alt="${movie.title}" />
      <h3 id="card_title" class="card_title">${movie.title}</h3>
      <p id="cardInfo" class="cardInfo">${movie.overview}</p>
      `;
      
  cardDiv.addEventListener('click', async function(){
    const movieDetail = await getMovieDetail(movie.id);
    showMoiveModal(movieDetail);
  });
  
  return cardDiv;
}

searchBtn.addEventListener('click', async function (e) {
  e.preventDefault();
  const searchData = await searchMovie();
 
  movieList.innerHTML = ''; // card_container 초기화

  if (searchData.results && searchData.results.length > 0) {
    searchData.results.forEach((movie) => {
      const card = makeMovieList(movie);
      movieList.appendChild(card);
    });
  } else {
    movieList.innerHTML = '<p>검색 결과가 없습니다.</p>';
  }
});


// 검색 
async function searchMovie() {
  const searchInput = document.querySelector('#searchInput');
  console.log(searchInput.value);

  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${searchInput.value}&language=en-US&page=1`,
      options
    );
    const data = await res.json();
    console.log(data.results);
    return data;
  } catch (e) {
    console.error(e);
  }
}


// 클릭시 영화 상세 정보 구해오기 
async function getMovieDetail(movieId) {
  try {
    const res = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?language=en-US`, options);
    const data = await res.json();
    console.log(data);
    return data;
  } catch (e) {
    console.error(e);
  }
}


// 모달창 생성
function showMoiveModal(movie) {
  const temp = document.querySelector('#movie-modal-template');
  const modalClone = temp.content.cloneNode(true);
  
  console.log("temp : ", temp);
  console.log(`showMoiveModal data: ${movie.title}`);
  modalClone.querySelector('#modal-title').textContent = movie.title;
  modalClone.querySelector('#modal-image').src = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`;
  modalClone.querySelector('#modal-image').alt = movie.title;
  modalClone.querySelector('#modal-overview').textContent = movie.overview;
  modalClone.querySelector('#modal-release-date').textContent = movie.release_date;
  modalClone.querySelector('#modal-genres').textContent = movie.genres.map(genre => genre.name).join(', ');


  const modal = modalClone.querySelector('.modal');
  const closeBtn = modalClone.querySelector('.close');
  
  closeBtn.addEventListener('click', () => {
  modal.remove();
  });
  
    
  document.body.appendChild(modalClone);
  
   
}




// init
function init(){
  popularFunc();
}


init();