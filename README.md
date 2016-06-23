# [Fincensus](https://fincensus.herokouapp.com)

A visualization tool for consumer opinion on financial products built with the MERN stack: MySQL, Express, React/Redux, Node

## Table of Contents

1. [Usage](#usage)
1. [Requirements](#requirements)
1. [Development](#development)
    1. [Installing Dependencies](#installing-dependencies)
    1. [Tasks](#tasks)
    1. [Launching App](#launching-app)
1. [Team](#team)
1. [Roadmap](#roadmap)
1. [Contributing](#contributing)

## Usage <a id="usage"></a>

[Fincensus](https://fincensus.herokouapp.com) was developed to visually inform the public of trends in complaints by U.S. citizens on financial products. This is accomplished by providing a visualization of registered [U.S. Census](http://www.census.gov/popest/data/datasets.html) and [Consumer Complaints](http://catalog.data.gov/dataset/consumer-complaint-database#topic=consumer_navigation) data sources.

## Requirements <a id="requirements"></a>

 Make sure you have installed all of the following prerequisites on your development machine:

* Node 4.4.5
* Express 4.13.4
* React 15.0.2
* Redux 3.5.2
* Sequelize 3.22.0
* MySQL 2.10.x

## Development <a id="development"></a>

### Installing Dependencies <a id="installing-dependencies"></a>

From within the root directory:

```sh
npm install
```

### Build Tasks <a id="tasks"></a>

To build the project from within the root directory from a bash CLI:

```sh
npm test
npm build
npm dev
```
This series of commands will run the mocha suite test, build the client files, and serve the client files to `http://localhost:3333`, respectively.

*Note*: client/test/ will be ignored in build

## Team <a id="team"></a>

+ Nicolas Vinson

### Roadmap <a id="roadmap"></a>

View the project roadmap [here](https://github.com/fincensus/issues)


## Contributing <a id="contributing"></a>

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.
