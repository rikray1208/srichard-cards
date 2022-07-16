const cards = document.querySelectorAll(".memory-card");
const btnResetGame = document.querySelector(".mods__btn-reload");
const btnHp = document.querySelector(".--btn__hp");
const btnDefault = document.querySelector(".--btn__default");
const btnDanlepe = document.querySelector(".--btn__danlepe");
const healhBar = document.querySelector(".hp");
const HealhIcon = document.querySelectorAll(".hp__icon");
const brokenHeartAudio = document.querySelector(".broken-heart")
const danlepAudio = document.querySelector(".danlep-audio")

let gameMode;
let hasCardOpen = false;
let lockBoard = false;
let firstCard, secondCard;

let hp = 0;

gameMode = parseInt(localStorage.getItem("mode"));

// основыне функции
function addClickCards() {
	cards.forEach(card => card.addEventListener('click', flipCard));
}
addClickCards()

function flipCard(){
	if(lockBoard) return;

	this.classList.add('flip');

	if (this.dataset.card == 7) {
		danlepAudio.play();
	}
	
	if(!hasCardOpen) {
		hasCardOpen = true;
		firstCard = this;

		return;
	}
	//второй клик
	secondCard = this;
	cardsCehk();
}

function cardsCehk() {
	let resultChek = firstCard.dataset.card === secondCard.dataset.card;

	if (gameMode === 2) {
		if (firstCard.dataset.card == 7 && secondCard.dataset.card != 7  
			|| firstCard.dataset.card != 7 && secondCard.dataset.card == 7) {
			setTimeout(() => {
				danlepeMode();
				return;
			}, 1500)
		}
	}

	resultChek ? disableCards() : unFlip();
}

function disableCards() {
	firstCard.removeEventListener('click', flipCard);
	secondCard.removeEventListener('click', flipCard);
	resetBoard();
}

function unFlip(){
	lockBoard = true;

	setTimeout(() => {
		firstCard.classList.remove('flip');
		secondCard.classList.remove('flip');

		resetBoard()
	},1500)

	if (gameMode == 1) {
		removeHeart()
		if(hp == 0) {
			setTimeout(() => {
				hpMode();
			}, 2000)
		}
	}
	
}

function resetBoard() {
	[hasCardOpen, lockBoard] = [false, false];
	[firstCard, secondCard] = [null, null];
  }


function resetGame() {
	lockBoard = true;

	cards.forEach(element => {	
		element.classList.remove('flip');			
	});

	setTimeout(() => {
		cards.forEach(element => {
			let randomPos = Math.floor(Math.random() * 12);
			element.style.order = randomPos;
		});

		resetBoard()
	},500)

	addClickCards();
}

function startMod() {
	if (gameMode == 1) {
		hpMode();
	}
	
	if (gameMode == 3) {
		resetGame();
	}

	if (gameMode == 2) {
		danlepeMode();
	}

	if (gameMode == NaN) {
		resetGame();
	}

	if (isNaN(gameMode)) {
		resetGame();
	}
}
startMod();

// фцнкуии режима хп
function hpMode() {
	if(hp == 5) {
		resetGame();
		return;
	} else {
		HealhIcon[hp].style.opacity = 1;
		HealhIcon[hp].src = "images/hp.png";
		hp += 1;
		setTimeout(() => {
			 hpMode();
		}, 100)
	}
}

function removeHeart() {
	hp -= 1;
	HealhIcon[hp].src = "images/hg.png";
	brokenHeartAudio.play();

	hpAnimation(HealhIcon[hp]);
	healhUp();
}

function hideHp() {
	HealhIcon.forEach(element => {
		element.style.opacity = 0;
	});
}

function hideShow() {
	HealhIcon.forEach(element => {
		element.style.opacity = 1;
	});
}
//фцнкуии режима danlepe
function danlepeMode() {
	resetGame();
	showDanlepe()
}

function showDanlepe() {
	cards.forEach(element => {
		if(element.dataset.card == 7) {
			element.classList.remove('--memory-card__hide');
			console.log(element)
		}
		if(element.dataset.card == 6) {
			element.classList.add('--memory-card__hide');
		}
	});
}

function hideDanlepe() {
	cards.forEach(element => {
		if(element.dataset.card == 7) {
			element.classList.add('--memory-card__hide');
			console.log(element)
		}
		if(element.dataset.card == 6) {
			element.classList.remove('--memory-card__hide');
		}
	});
}


// события
btnResetGame.addEventListener('click', () => {
	if(gameMode == 1) {
		hpMode();
	}
	if(gameMode == 3){
		resetGame();
	}
	if(gameMode == 2){
		danlepeMode ();
	}
});
btnHp.addEventListener('click', () => {
	gameMode = 1;
	localStorage.setItem("mode", 1);
	hideShow();
	hpMode();
	hideDanlepe();
});
btnDefault.addEventListener('click', () => {
	gameMode = 3;
	localStorage.setItem("mode", 3);

	resetGame();
	hideHp();
	hideDanlepe();
})
btnDanlepe.addEventListener('click', () => {
	gameMode = 2
	localStorage.setItem("mode", 2);

	danlepeMode();
	hideHp();
})

//animation
let counerhpAnimation = 0;
let counerhealhUp = 0;
export function hpAnimation(currentElement) {
	
	
	if (counerhpAnimation == 2) {
		counerhpAnimation = 0;
		return;
	} else {
		HealhIcon.forEach(element => {
				
			if (element.src == currentElement.src) {
				return;
			};
			element.src = "images/hpwihte.png";
			setTimeout(() => {
				element.src = "images/hp.png";
			}, 300)
		});
		setTimeout(() => {
			counerhpAnimation += 1;
			hpAnimation(currentElement);
		},600)
	}
	
}

export function healhUp() {
	if (counerhealhUp == 4) {
		counerhealhUp = 0;
		return;
	} else {
		counerhealhUp += 1;
		HealhIcon[counerhealhUp].classList.add("--hp__icon-up");
		setTimeout(() => {
			HealhIcon[counerhealhUp].classList.remove("--hp__icon-up");
		}, 100)			
		setTimeout(() => {
			return healhUp();
		},100)
	}
}
