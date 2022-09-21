
class HealthBar {
	constructor(maxHealth, $bar, $barValue, color) {
		this.maxHealth = maxHealth;
		this.health = maxHealth;

		this.color = color;

		this.bar = $bar
		this.valueElem = $barValue;

		this.bar.style.background = this.color
	}

	updateHealth(newHealth) {
		if (this.withinBounds(newHealth)) {
			this.health = newHealth;
			this.bar.style.width = ((this.health / this.maxHealth) * 100) + '%';
			this.valueElem.textContent = Math.round(newHealth) + ' / ' + this.maxHealth;
		}
	}

	updateMaxHealth(newMaxHealth) {
		if (newMaxHealth <= 0) {
			return
		}

		// use JS hacks to dereference
		let oldMaxHealth = JSON.parse(JSON.stringify(this.maxHealth))
		let oldHealth = JSON.parse(JSON.stringify(this.health))

		// ok, what percentage were we at?
		let percentage = oldHealth / oldMaxHealth // no *100 as multiplying by a decimal makes this easier

		// now multiply the new max health by that percentage to get the new
		// value of health
		let newHealthValue = newMaxHealth * percentage

		// do the updates
		this.maxHealth = newMaxHealth
		this.updateHealth(newHealthValue)
	}

	withinBounds(val) {
		return val >= 0 && val <= this.maxHealth
	}
}

const $bar = document.getElementById("healthbar");
const $barValue = document.getElementById('healthbar-value');

/*-------------------------------------
If you wish to change the health total
change "let health = 100" to the desired 
max HP value
---------------------------------------*/
let health = 100; // total amount of health default 100

const healthBar = new HealthBar(health, $bar, $barValue, "CornflowerBlue");

// keypress, keyup and keydown all handle key events.
// keypress is not triggered for arrows though
function onKeyPressHandler(evt) {
	let health = healthBar.health

	let incr = 1
	let coefficient = 1
	if (evt.shiftKey) {
		coefficient *= 5
	}

	// check within bounds, otherwise you can click for ages. then need to
	// go alll the way back to before it exceeded the max, before the bar 
	// updates the value.
	switch (evt.key) {
		case "ArrowLeft":
			evt.preventDefault()
			if (healthBar.withinBounds(health - (incr * coefficient))) {
				health -= (incr * coefficient)
			} else if (health - (incr * coefficient) < 0) {
				health = 0
			}

			// could be prevented if not within bounds, but eh. wasted effort, minimal gain.
			healthBar.updateHealth(health)

			break
		case "ArrowRight":
			evt.preventDefault()
			if (healthBar.withinBounds(health + (incr * coefficient))) {
				health += (incr * coefficient)
			} else if (health + (incr * coefficient) > healthBar.maxHealth) {
				health = healthBar.maxHealth
			}

			// could be prevented if not within bounds, but eh. wasted effort, minimal gain.
			healthBar.updateHealth(health)

			break
		case "ArrowUp":
			evt.preventDefault()
			healthBar.updateMaxHealth(healthBar.maxHealth + 100)
			break
		case "ArrowDown":
			evt.preventDefault()
			healthBar.updateMaxHealth(healthBar.maxHealth - 100)
			break
	}
}

healthBar.updateHealth(health)
document.addEventListener('keydown', onKeyPressHandler)