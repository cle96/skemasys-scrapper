# skemasys-scrapper

A simple javascript scrapper that will fetch the data from skemasys and display it in the console

## Requirements

* NodeJS

## Installation

```
npm install
```

## Run script
```
node app.js
```

## Set subjects
```
node app.js -s cSharp
node app.js -s algorithms
node app.js -s databases
node app.js -s all
node app.js -s cSharp,databases
node app.js -s cSharp,algorithms,databases (equivalent of all)
```

## Set time
```
node app.js -t today
node app.js -t tomorrow
node app.js -t this_week
node app.js -t next_week
```

## Set period
```
node app.js -p <DD-MM-YYYY>_to_<DD-MM-YYYY>
node app.js -p 13-03-2017_to_17-03-2017
```

## Full commands
```
node app.js -s all -t today
node app.js -s cSharp -p 18-04-2017_to_17-05-2017
```

## Tricks - create alias (Linux)
```
vi ~/.bashrc OR gedit ~/.bashrc
alias timetable='cd ~/<PROJECT_PATH>/skemasys-scrapper/ && node app.js -s all'
. ~/.bashrc

It will create a shortcut in bash, so you can easily get the tables using "timetable -t today"
```