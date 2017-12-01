#!/usr/bin/env node

const fs = require('fs')
const https = require('https')
const meow = require('meow')
const path = process.cwd() + '/.gitignore'

const cli = meow(
    `
    Usage
      $ deny <input>

    Examples
      $ deny macos node
    `
)

fs.exists(path, exists => {
    if (exists) {
        console.log('.gitignore already exists')
    } else {
        if (!cli.input.length) {
            console.log(
                'you need to provide some keyword(s). eg: $ deny macos node'
            )
        } else {
            const argv = cli.input.map(s => s.toLowerCase()).join('%2C')
            const url = 'https://www.gitignore.io/api/' + argv
            https
                .get(url, res => {
                    res.pipe(fs.createWriteStream(path, 'utf-8'))
                })
                .on('close', () => {
                    console.log('Added .gitignore in current directory')
                })
                .on('error', e => {
                    console.log('Unable to generate .gitignore file')
                })
        }
    }
})
