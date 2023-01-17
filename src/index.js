import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;

const input = document.querySelector('#search-box');
const list = document.querySelector('.country-list');
const info = document.querySelector('.country-info');

let inputCountry = '';

input.addEventListener("input", debounce(iptStart, DEBOUNCE_DELAY));

function iptStart() {
  inputCountry = input.value.trim();
    if (inputCountry === '') {
        clearAll();
        return;
    } else fetchCountries(inputCountry).then(name => {
        if (name.length < 2) {
            createCountrie(name);
        } else if (name.length < 10 && name.length > 2) {
            createCountrieList(name);
        } else {
            clearAll();
            Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
        };
    })
        .catch(() => {
        clearAll();
        Notiflix.Notify.failure('Oops, there is no country with that name.');
    });
};

function createCountrie(country) {
    clearAll();
    const location = country[0];
    const finishedCountry = `<div class="country-card">
        <div class="country-card--header">
            <img src="${location.flags.svg}" alt="Country flag" width="200", height="100">
            <h2 class="country-card--name"> ${location.name.official}</h2>
        </div>
            <p class="country-card--field">Capital: <span class="country-value">${location.capital}</span></p>
            <p class="country-card--field">Population: <span class="country-value">${location.population}</span></p>
            <p class="country-card--field">Languages: <span class="country-value">${Object.values(location.languages).join(',')}</span></p>
    </div>`
    info.innerHTML = finishedCountry;
};

function createCountrieList(country) {
    clearAll();
    const finishedList = country.map((location) => 
        `<li class="country-list--item" style="list-style:none;">
            <img src="${location.flags.svg}" alt="Country flag" width="100", height="50" >
            <span class="country-list--name">${location.name.official} </span>
        </li>`)
        .join("");
    list.insertAdjacentHTML('beforeend', finishedList);
};

function clearAll() {
  list.innerHTML = '';
  info.innerHTML = '';
};
