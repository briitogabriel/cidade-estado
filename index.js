const fs = require('fs').promises;

let states = [];
let cities = [];

init();

async function init() {
    await createStateFile();
    await getQtdCities('SC');
    await maxMinUf();
    await maxCityNameByUf();
    await minCityNameByUf();
    await maxCityName();
    await minCityName();
}

//1. Cria um arquivo json para cada estado contendo as cidades que pertencem a ele
async function createStateFile() {
    cities = JSON.parse(await fs.readFile('Cidades.json'));
    states = JSON.parse(await fs.readFile('Estados.json'));

    states.forEach(state => {
        let filteredCities = [];

        cities.filter(city => {
            if (city.Estado === state.ID) {
                filteredCities.push(city);
            }
        });

        fs.writeFile(`./estados/${state.Sigla}.json`, JSON.stringify(filteredCities, null, 2));
    })
}

async function countCities(uf) {
    uf = uf.toUpperCase();

    let selectedUf = JSON.parse(await fs.readFile(`estados/${uf}.json`));

    return selectedUf.length;
}

//2. Recebe como parâmetro o estado e realiza a leitura do arquivo, retornando a quantidade de cidades
async function getQtdCities(uf) {
    uf = uf.toUpperCase();
    let qtd = await countCities(uf);

    console.log(`O estado de ${uf} tem ${qtd} cidades.`);
}

//3. Retorna os 5 estados com mais cidades
//4. Retorna os 5 estados com menos cidades
async function maxMinUf() {
    let totalCities = [];

    for (state of states) {
        let qtd = await countCities(state.Sigla);

        totalCities.push(`${state.Sigla} - ${qtd}`);
    }

    let biggestUF = await totalCities.sort((a, b) => {
        let uf1 = a.split(" - ");
        let uf2 = b.split(" - ");

        return uf1[1] - uf2[1];
    }).slice(-5).reverse();

    let smallerUF = await totalCities.sort((a, b) => {
        let uf1 = a.split(" - ");
        let uf2 = b.split(" - ");

        return uf1[1] - uf2[1];
    }).slice(0, 5).reverse();

    console.log(`Os cinco estados com mais cidades são: ${biggestUF}`);
    console.log(`Os cinco estados com menos cidades são: ${smallerUF}`);
}

//Retorna um novo obj state contendo as cidades pertencentes
async function getCities() {
    const promises = states.map(state =>
        fs.readFile(`./estados/${state.Sigla}.json`)
    );

    const promisesRes = await Promise.all(promises);

    states = states.map((state, index) => ({
        ...state,
        cities: JSON.parse(promisesRes[index]),
    }));

    return states;
}

//5. Imprimir no console um array com a cidade de maior nome de cada estado
async function maxCityNameByUf() {
    const states = await getCities();

    const result = states.map(state => {
        let cities = state.cities.sort((a, b) => {
                if (a.Nome.length === b.Nome.length) {
                    return a.Nome.localeCompare(b.Nome);
                }

                return b.Nome.length - a.Nome.length;
            }
        );

        return {
            ...state,
            cities,
        };
    });

    console.log('A cidade com maior nome de cada estado é: ')
    result.forEach(item => {
        console.log(`${item.cities[0].Nome} - ${item.Sigla}`);
    })
}

//6. Imprimir no console um array com a cidade de menor nome de cada estado
async function minCityNameByUf() {
    const states = await getCities();

    const result = states.map(state => {
        let cities = state.cities.sort((a, b) => {
                if (a.Nome.length === b.Nome.length) {
                    return a.Nome.localeCompare(b.Nome);
                }

                return a.Nome.length - b.Nome.length;
            }
        );

        return {
            ...state,
            cities,
        };
    });

    console.log('A cidade com menor nome de cada estado é: ')
    result.forEach(item => {
        console.log(`${item.cities[0].Nome} - ${item.Sigla}`);
    })
}

//7. Exibir a cidade de maior nome
async function maxCityName() {
    const result = cities.sort((a, b) => {
        if (a.Nome.length === b.Nome.length) {
            return a.Nome.localeCompare(b.Nome);
        }
        return b.Nome.length - a.Nome.length;
    })[0];

    const state = states.find((state) => state.ID === result.Estado);
    console.log(`A cidade com maior nome é: ${result.Nome} - ${state.Sigla}`);
}

//8. Exibir a cidade de menor nome
async function minCityName() {
    const result = cities.sort((a, b) => {
        if (a.Nome.length === b.Nome.length) {
            return a.Nome.localeCompare(b.Nome);
        }
        return a.Nome.length - b.Nome.length;
    })[0];

    const state = states.find((state) => state.ID === result.Estado);
    console.log(`A cidade com menor nome é: ${result.Nome} - ${state.Sigla}`);
}


