const argv = require('minimist')(process.argv.slice(2))
const prompt = require('prompt')
const colors = require('colors')
const _ = require('lodash')
const fs = require('fs')

console.log('------Welcome to--------'.rainbow)
console.log('-----HEADS-&-TAILS------'.rainbow)

let rounds
let wins
let loses


initGame()

function initGame() {
    rounds = 0
    wins = 0
    loses = 0

    console.log('Do u wanna play? (Choose Y or N)')

    fs.exists('./logs.txt', (exists) => {
        if (!exists) fs.writeFile('./logs.txt', '', err => {
            if (err) throw err
        })
        appendLogs('initialization...')
    })
    askPlay()
}

function _getDate() {
    let date = new Date()
    return '[' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + ']'
}

function appendLogs(log) {
    fs.appendFile('./logs.txt',
        _getDate() + ' > ' + log + '\n',
        err => {
            if (err) throw err
        })
}

function askPlay() {
    let wannaPlaySchema = {
        properties: {
            agree: {
                pattern: /^[yYnN\s\-]+$/,
                message: 'y or n?',
                required: true
            }
        }
    }
    prompt.start()
    prompt.get(wannaPlaySchema, (err, result) => {
        if (err) {
            console.error(err)
            return
        }
        if (result.agree.toLowerCase() == 'y') startRound()
        else endGame()
    })
}

function endGame() {
    console.log('-------------GAME OVER--------------')
    console.log("YOU:", wins, " ENEMIES:", loses)
    if (wins > loses) console.log('YOU TOTALLY WIN!')
    else if (wins == loses) console.log('May be nex time...')
    else console.log('YOU ARE WORST PLAYER EVER!')


    appendLogs('---')
}

function startRound() {
    rounds++
    appendLogs('Started Round ' + rounds)
    console.log("Let's go! ---------------".rainbow)
    console.log('Round', rounds, ', fight!')
    console.log('Choose your side!')

    const sides = [{
        name: 'Dark',
        color: 'black',
        bg: 'bgWhite'
    }, {
        name: 'Light',
        color: 'white',
        bg: 'bgBlack'
    }, {
        name: 'Green',
        color: 'green',
        bg: 'bgBlack'
    }, {
        name: 'Yellow',
        color: 'yellow',
        bg: 'bgBlack'

    }, {
        name: 'Rainbow',
        color: 'rainbow',
        bg: 'bgBlack'
    }]

    function _renderSide(side) {
        return _.capitalize(side.name)[side.color][side.bg]
    }

    sides.forEach((side, i) => console.log((i + 1) + '. ' + _renderSide(side)))

    let choiseSchema = {
        properties: {
            side: {
                pattern: /^[1-5]/,
                message: 'choose one of 5 sides',
                required: true
            }
        }
    }

    prompt.start()

    prompt.get(choiseSchema, (err, result) => {
        if (err || result.side > sides.length) {
            console.error(err)
            return
        }
        let userSide = sides[result.side - 1]
        let enemies = _.filter(sides, (s, i) => i != result.side - 1)

        appendLogs('User choose ' + result.side + ' ' + userSide.name)
        console.log('Your are for the ', _renderSide(userSide), 'side!')
        console.log('You fight against the', _.map(enemies, e => _renderSide(e)).join(', '))

        let winner = Math.floor(Math.random() * sides.length)
        let wait = setInterval(afterPlay, 1)

        function afterPlay() {

            clearInterval(wait)
            console.log("-----------------------".rainbow)
            console.log('God choose:', _renderSide(sides[winner]), '\nYour side:', _renderSide(userSide))

            appendLogs('Winner ' + winner + ' ' + sides[winner].name)
            if (result.side - 1 == winner) {
                wins++
                console.log("YOU WIN! Your enemies are totally DEAD!" [userSide.color][userSide.bg])
            } else {
                loses++
                console.log("YOU LOSE! You are dead and your enemies spit on you!".red)
            }

            appendLogs('wins ' + wins + ' loses ' + loses)
            console.log("-----------------------".rainbow)
            console.log("YOU:", wins, " ENEMIES:", loses)
            console.log("-----------------------".rainbow)
            console.log('Wanna play again?')

            askPlay()
        }

    })
}
