document.addEventListener('DOMContentLoaded', () => {
	'use strict';

	const heroesBlock = document.querySelector('.heroes__block'),
		heroesSelect = document.querySelector('.heroes__select');


	//Создание запроса к серверу
	const createRequest = () => fetch('./dbHeroes.json', { method: 'GET', headers: { 'Content-Type': 'application/json' } });


	//Создание карточки героя
	const createHero = data => {
		data.forEach(item => {
			const heroCard = document.createElement('div');
			heroCard.classList.add('hero__card');
			heroCard.innerHTML = `<div class='hero__photo'>
                              <img src='${item.photo}' alt='${item.name}'>
                            </div>
                            <div class='hero__description'>
                              <h2 class='hero__name'>${item.name}</h2>
                              <ul class='hero__list'></ul>
                            </div>`;

			for (const key in item) {
				if (key !== 'name' && key !== 'photo') {
					const listItem = document.createElement('li');
					if (key === 'movies') {
						listItem.innerHTML = `<strong>${key[0].toUpperCase() + key.slice(1)}:</strong> ${item[key].join(', ')}`;
					} else {
						const regExpUpper = /[A-Z]{1}\D+$/g,
							regExpLower = /^[a-z]+/g;
						let keys = key;

						if (regExpUpper.test(key)) {
							const keysArr = [...key.match(regExpLower), ...key.match(regExpUpper)];

							if (keysArr[0] === 'birth') {
								keys = keysArr.join('').toLowerCase();
							} else {
								keys = keysArr.join(' ').toLowerCase();
							}
						}

						listItem.innerHTML = `<strong>${keys[0].toUpperCase() + keys.slice(1)}:</strong> ${item[key][0].toUpperCase() + item[key].slice(1)}`;
					}
					heroCard.querySelector('.hero__list').append(listItem);
				}
			}

			heroesBlock.append(heroCard);
		});
	};


	//Создание Set с фильмами
	const createSet = data => {
		const set = new Set();

		set.add('All movies');

		data.forEach(item => {
			for (const key in item) {
				if (key === 'movies') {
					item[key].forEach(item => {
						set.add(item);
					});
				}
			}
		});

		return set;
	};


	//Создание выпадающего списка с фильмами
	const createSelect = data => {
		const select = document.createElement('select'),
			set = createSet(data);

		select.classList.add('movie__select');

		set.forEach(item => {
			const option = document.createElement('option');

			option.textContent = item;
			option.setAttribute('value', item);
			select.append(option);
		});

		heroesSelect.append(select);
	};


	//Фильт по фильмам
	const filterData = (event, data) => {
		const result = [];
		data.forEach(item => {
			for (const key in item) {
				if (key === 'movies') {
					item[key].forEach(movie => {
						if (event.target.value === movie) {
							result.push(item);
						}
					});
				}
			}
		});
		return result;
	};


	//Получение и обработка данных данных
	const getData = () => {
		createRequest().then(response => {
			if (response.status !== 200) {
				throw new Error('Server status not 200');
			}
			response.text().then(data => {
				data = JSON.parse(data);
				createSelect(data);
				createHero(data);
				heroesSelect.addEventListener('change', event => {
					if (event.target.value !== 'All movies') {
						const result = filterData(event, data);
						heroesBlock.textContent = '';
						createHero(result);
					} else if (event.target.value === 'All movies') {
						heroesBlock.textContent = '';
						createHero(data);
					}
				});
			});
		}).catch(error => {
			console.error(error);
		});
	};

	getData();
});
