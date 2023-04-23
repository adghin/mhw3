/* Key for GBooks */
const maxResults = 6;
const gbooks_key = 'AIzaSyD3UU0O6qQ3plwI3ydsAaR6PeAVY1yX6-Q';
const gbooks_endpoint = 'https://www.googleapis.com/books/v1/volumes';

/* Client and secret ID for Spotify */
const spot_id = '15177f095489489a8daa35ed60ddfde8';
const spot_secret = '515c686ade844ed48e21590d21c1207c';
const spot_token_endpoint = 'https://accounts.spotify.com/api/token';
const spot_recommendations = 'https://api.spotify.com/v1/search';

function onResponse(response) {
	return response.json();
}

function onJSON(json) {
	results_container.innerHTML = '';
	results_container.classList.remove('hidden');

	for(const item of json.items) {
		let url = item.volumeInfo.imageLinks;
		if(url !== undefined) {
			url = item.volumeInfo.imageLinks.thumbnail;
			const title = item.volumeInfo.title;
			const author = item.volumeInfo.authors;
			const description = item.volumeInfo.description;
		    
			appendHTML(url,title,author,description);
		}
	}
}

function onSpotJSON(json) {
	const randomNum = Math.floor(Math.random()*maxResults);
	const song_id = json.tracks.items[randomNum].id;

	const iframe = document.querySelector('iframe');
	iframe.classList.add('visible');
	iframe.src = 'https://open.spotify.com/embed/track/' + song_id + '?utm_source=generator';
}

function appendHTML(url,title,author,descr) {
	const article = document.createElement('article');
	const div1 = document.createElement('div');
	const div2 = document.createElement('div');

	article.classList.add('flex-item');
	div1.classList.add('first-child-item');
	div2.classList.add('second-child-item');

	const img_elem = document.createElement('img');
	const h3 = document.createElement('h3');
	const h5 = document.createElement('h5');

	img_elem.src = url;
	h3.textContent = title;
	
	if(author === undefined)
		h5.textContent = 'No author found for this book!';
	else 
		h5.textContent = author;

	let p = document.createElement('p');
	
	if(descr === undefined)
		p.textContent = 'No description found for this book!';
	else
		p.textContent = descr;

	div1.appendChild(img_elem);
	div2.appendChild(h3);
	div2.appendChild(h5);
	div2.appendChild(p);

	article.appendChild(div1);
	article.appendChild(div2);
	results_container.appendChild(article);
	results_container.classList.add('scroll');
}

function search(event) {
	event.preventDefault();

	text_value = encodeURIComponent(text_input.value);

	const url = gbooks_endpoint + '?q=' + text_value + '&key=' + gbooks_key + '&maxResults=' + maxResults;
	fetch(url,
		{
			headers: 
			{
				'Content-Type':'application/x-www-form-urlencoded'
			}
		}
	).then(onResponse).then(onJSON);
}

function getRecommendations(event) {
	let url;
	url = spot_recommendations + '?type=track' + '&q=' + text_value + '&limit=' + maxResults;
	fetch(url,
		{
			headers: 
			{
				'Authorization': token_data.token_type + ' ' + token_data.access_token
			}
		}
		
	).then(onResponse).then(onSpotJSON);
}

function getToken(json) {
	token_data = json;
}

let token_data;
fetch(spot_token_endpoint,
	{
		method: 'POST',
		body: 'grant_type=client_credentials',
		headers: 
		{
			'Authorization':'Basic ' + btoa(spot_id + ':' + spot_secret),
			'Content-Type':'application/x-www-form-urlencoded'
		}
	}
).then(onResponse).then(getToken);

/* --- Main code --- */
const search_content = document.querySelector('form');
search_content.addEventListener('submit',search);

const text_input = document.querySelector('#content');
let text_value;

const recomm = document.querySelector('#recommendations');
recomm.addEventListener('click',getRecommendations);

const results_container = document.querySelector('#flex-container');