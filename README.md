# bruteforce_JS

## About
* Bruteforce_JS is a bruteforce app with 2 modes: Doctionnary and pure Bruteforce
* It contains a simple website with a login page
* It's all set to be used on the /website login simulation program but it can be use others website

## Prerequisites
#### You need to have node v14.15.1 or newer to to ensure the proper functioning of this app

## Installation
#### To install Nightwatch eduservices, you need to clone this repository with the following command: <br />
```git clone https://github.com/TavernierAlicia/bruteforce_js.git```

#### Then install node packages: <br />
```npm install```

## Getting started

### First, launch the webapp program
#### You can found it in bruteforce_js/website: 3 versions are availlable --> Windows, Linux and MacOS

#### You can just click on it or launch with <br />
```./exec4{YourOS} ``` 

:warning: Many permissions can be asked depending on your os, if you decline them, the program may not run as expected

#### The console show this message ``` [GIN-debug] Listening and serving HTTP on :9999 ```, the webapp is running

:bulb: You can edit webapp login data in file "config.json"

### Then, launch the bruteforce app
#### You can launch it with this command <br />
```npm run start```

#### Now, the console is asking for a target website, this field is optionnal and http://localhost:9999 will be set as default, so you can just press enter to ignore it

#### Same for username, the default is set to "bobby91", the default username set in config.json

#### The password level is set by default to 0, but you can enter a number up to 4
- 0 is for a very easy word password lowercase chars
- 1 is for a series of words with upper and lowercase chars
- 2 is for a words and numeric combinaison and upper/lowercase chars
- 3 is for a sentence switching letter by numerics and upper/lowercase chars
- 4 is for a super hard random password with numerics, special chars, and upper/lowercase chars

#### Now it's time to choose the attack mode:
- 1 is for Dictionnary attack
- 2 is for Bruteforce attack

#### In Bruteforce mode, the min length password then the max length password are asked, if you ignore this input, it will be set to 6 and 12

### And we're good, it's running
* patience is a virtue :lotus_position:	
