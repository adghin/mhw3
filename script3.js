
/* Client and secret ID for OAuth */
const token_endpoint = 'https://oauth.battle.net/token';
const client_id = 'db052a31442d46b289a6c9ee2a8916fd';
const client_secret = 'SVUBYV8J6maSPYW8jjbrTk6yUT0wAyUa';
const cards_endpoint = 'https://us.api.blizzard.com/hearthstone/cards/678?locale=en_US';

function onResponse(response) {
	return response.json();
}

let token_data;

function getToken(json) {
	token_data = json;
	console.log(token_data);
}

function onJSON(json) {
	console.log(json);
}

function search(event) {
	event.preventDefault();
	fetch(cards_endpoint,
	{
		headers: {
			'Authorization': token_data.token_type + ' ' + token_data.access_token
		}
	}

	).then(onResponse).then(onJSON);
	
}

	fetch(token_endpoint,
			{
				method : 'POST',
				body   : 'grant_type=client_credentials&client_id=' + client_id + '&client_secret=' + client_secret,
				headers:
				{
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			}
	).then(onResponse).then(getToken);

/* --- Main code --- */
const search_content = document.querySelector('form');
search_content.addEventListener('submit',search);