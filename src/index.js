import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.5.min.css';

import debounce from 'lodash.debounce';

import './css/styles.css';
import fetchCountries from './js/fetchCountries.js';

const DEBOUNCE_DELAY = 300;

const inputField = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

inputField.addEventListener('input', debounce(searchCountry, DEBOUNCE_DELAY));

function searchCountry(evt) {
  const countries = evt.target.value.trim();

  if (countries === '') {
    countryInfo.innerHTML = '';
    countryList.innerHTML = '';
    return;
  }

  fetchCountries(countries)
    .then(doCountryMarkup)
    .catch(error => Notiflix.Notify.failure('Oops, there is no country with that name'));
}

function doCountryMarkup(countries) {
  if (countries.length > 10) {
    Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
    countryList.innerHTML = '';
  }

  const markup = countries
    .map(({ name, capital, population, flags, languages }) => {
      return `<img src="${flags.svg}" alt="${name.official}" width="30px">
          <h1 class="official-name">${name.official}</h1>
          <p><b>Capital:</b> ${capital}</p>
          <p><b>Population:</b> ${population}</p>
          <p><b>Langueges:</b> ${Object.values(languages)}</p>`;
    })
    .join('');
  countryInfo.innerHTML = markup;

  if (countries.length > 1) {
    countryInfo.innerHTML = '';
  }

  doCountryMarker(countries);
}

function doCountryMarker(countries) {
  if (countries.length >= 2 && countries.length <= 10) {
    const markup = countries
      .map(({ name, flags }) => {
        return `<li>
        <img src="${flags.svg}" alt="${name.official}" width="30px">
        <p class="official-name"><b>${name.official}</b>
      </li>`;
      })
      .join('');
    countryList.innerHTML = markup;
  }

  if (countries.length === 1) {
    countryList.innerHTML = '';
  }
}