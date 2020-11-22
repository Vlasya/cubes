const timeGame = 60 //Время на игру
let start = true, //старт
	time = timeGame, // время на игру для расчетов
	gameIsRun = false, // Игра запущена/нет
	score = 0, // очки юзера
	grid = 10, // Сетка для разметки игрового поля
	timer = null, // Таймер
	maxSizeCube = 80, //максимальный размер блока
	minSizeCube = 80 // минимальный размер блока


// цвета блоков для каждого уровня
// еще не реализовано ,но используется
const levelColors = {
	level_1: ['red', 'blue'],
	level_2: ['red', 'blue', 'orange', 'green'],
	level_3: ['red', 'blue', 'orange', 'green', 'black', 'yellow']
}

// массив юзеров и результов,которые рендерим на страницу
let userRender = [];

// массив для id добавляемых элементов
const cubeId = [];

// Кнопки Старта - Начала новой игры
let startBtn = document.querySelector('#start');
let newGamebtn = document.querySelector('#newGame');

// Игровая область
let gameArea = document.querySelector('.game-area')
//Ширина игровой области
let areaWidth = gameArea.clientWidth;
//ширина-высота каждого блока сетки
let widthRendersquare = (areaWidth / grid) - 1

// Поле таймера
let timeCountGame = document.querySelector('#time-count');

// Points
let countScore = document.querySelector('#pointsCount')

// PointScore in modal
let userScoreModal = document.querySelector('.userScore')

// Кнопка сохранения результатов
let saveResultBtn = document.querySelector('#saveResult')

// ---Listeners---
// Новая игра
newGamebtn.addEventListener('click', startNewGame);
// Стоп-пауза игры
startBtn.addEventListener('click', clickStartGame);
// сохранение результатов в модальном окне
saveResultBtn.addEventListener('click', saveResult)

// ---------Игра--------

// Начало Новой игры
function startNewGame(e) {
	gameArea.innerHTML = ''
	start = true;
	clearScore()
	stopTimer()
	timer = null
	time = timeGame
	startTimer()
	startGame()

}

// Запуск игры- сетка + блоки
function startGame() {
	renderGrid();
	createCube()
}
// Пауза=продолжение игры
function clickStartGame(e) {
	this.innerHTML = start ? "Start" : "Stop_";
	start = !start;
	if (!start) {
		stopTimer()
	} else {
		startTimer()
	}
}

// --------/-Игра--------



// Добавляем сетку 10х10 в игровое поле
function renderGrid() {
	for (let i = 1; i <= grid * grid; i++) {
		let grideArea = document.createElement('div');
		grideArea.style.width = `${widthRendersquare}px`;
		grideArea.style.height = `${widthRendersquare}px`;
		grideArea.setAttribute('id', `a${i}`)
		grideArea.classList.add(`cube-area`);
		gameArea.append(grideArea);
	}
}

//  -----------Игровые кубики--------------

// Рендер блоков
function createCube() {
	const checkId = (num) => {
		if (!cubeId[num]) {
			let startCubes = startRenderCubes()
			let renderBlock = document.querySelector(`#a${num}`);
			cubeId[num] = true;
			startCubes.addEventListener('click', function (e) {
				delCube(this)
			})
			renderBlock.appendChild(startCubes);
		} else {
			checkId(random(grid * grid, 1))
		}
	}
	// количество блоков,которые появляются при удалении ( рандом от 1( не как в ТЗ),т.е есть шанс не начать игру))
	let startGameCountCube = random(2, 1); 
	for (let i = 1; i <= startGameCountCube; i++) {
		let randomBlock = random(grid * grid, 1)
		checkId(randomBlock)
	}
}

// Создание блоков
function startRenderCubes() {
	let cube = document.createElement('div');
	cube.classList.add('cube')
	cube.classList.add(`${levelColors.level_1[Math.floor(Math.random() * levelColors.level_1.length)]}`);
	cube.style.backgroundColor = `rgb(${random(255,0)},${random(255,0)},${random(255,0)})`
	return cube
}

// Удаляем блоки
function delCube(_this) {
	if (start) {
		if (_this.parentNode) {
			delete cubeId[_this.parentNode.getAttribute('id').replace('a', '')]
			addScore()
			createCube()
			_this.remove()
		}
	}
}
//  ----------/-Игровые кубики--------------

// ------Таймер-------
// Запуск таймера
function startTimer() {
	timer = setInterval(timerGame, 1000)
}
// Остановка таймера
function stopTimer() {
	timer && clearInterval(timer)
}

// Таймер
function timerGame() {
	let minutes = Math.floor(time / 60);
	let second = Math.floor(time - (minutes * 60));
	minutes = minutes < 10 ? `0${minutes}` : minutes;
	second = second < 10 ? `0${second}` : second;
	--time
	timeCountGame.innerHTML = `${minutes} : ${second}`;

	if (time < 0) {
		stopTimer()
		$('#finishModal').modal('show');
		start = false;
		addUserScoreInModal();
	}
}
// ------ /-Таймер-------




// ------Рандомайзер------
function random(max, min) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}


// ----------Поинты----------

// Добавляем поинты
function addScore() {
	score++
	countScore.innerHTML = `${score}`
	return score
}

// Очистка поля поинтов
function clearScore() {
	score = 0
	countScore.innerHTML = `${score}`
}

// Выводим поинты в модальное окно
function addUserScoreInModal() {
	userScoreModal.innerHTML = `${score}`
}

// ---------/-Поинты----------


// ----------Результаты игры и вывод результатов-----------

// сохранение результата игры
function saveResult(e) {
	addToLocalStorage()

	// Прячем модалку
	$('#finishModal').modal('hide')

	// for(let key in localStorage){
	// 	console.log(JSON.parse(localStorage[key]));
	// }



}

// Создаем обЪект юзера и добавляем его в localStorage
function addToLocalStorage() {
	const userData = {
		name: document.querySelector('input').value,
		score: `${score}`
	}
	localStorage.setItem(`${userData.name}`, JSON.stringify(userData));
}

// вызов функции 
renderResultUser()

// Рендерим результаты на страницу
function renderResultUser() {
	// временный массив для юзеров из localStorage
	let user = [];
	// поле для результатов
	let resultUser = document.querySelector('.game-info'); 

	for (let key in localStorage) {
		if (!localStorage.hasOwnProperty(key)) {
			continue;
		}
		user.push(JSON.parse(localStorage[key]))
	}

	delDublicateUser(user)
	// рендерим отфильтрованные результаты
	userRender.forEach(item => {
		resultUser.innerHTML +=
			`
			<div class="resultUser">
			<p class="nameUser">${item.name}</p>
			<p class="coinsUser">${item.score}</p>
			</div>
			`
	})
}

// Проверяем новый массив ,если юзер уже есть,то сверяем его score  и исключаем его,если новый score меньше,чем уже есть
function delDublicateUser(arrLocalUser) {

	arrLocalUser.forEach(item => {
		if (userRender.length !== 0) {
			userRender.forEach(userRen => {
				if (userRen.name === item.name) {
					if (item.score > userRen.score) {
						userRender.push(item)
					} else {
						userRender.push(item)
					}
				}
			})
		}
		userRender.push(item)
	})
}

// ---------/-Результаты игры и вывод результатов-----------