import './css/styles.css';
import Notiflix from 'notiflix';
import Debounce from 'lodash.debounce';
import { fetchCountries } from './api/api-country-service';

const DEBOUNCE_DELAY = 300;

const refs = {
  inputField: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.inputField.addEventListener(
  'input',
  Debounce(onValueInput, DEBOUNCE_DELAY)
);

function onValueInput(e) {
  const searchQuery = e.target.value.trim();
  clearMarkUp();

  if (!searchQuery) {
    return;
  }

  fetchCountries(searchQuery)
    .then(countries => {
      if (countries.length > 10) {
        Notiflix.Notify.info(
          `Too many matches found. Please enter a more specific name.`
        );
      } else if (countries.length > 1 && countries.length <= 10) {
        for (const country of countries) {
          createCountriesMarkUp(country);
        }
      } else if (countries.length === 1) {
        createCoutryDetailsMarkUp(countries[0]);
      }
    })
    .catch(error =>
      Notiflix.Notify.failure(
        `${error} Oops, there is no country with that name`
      )
    );
}

function createCountriesMarkUp({
  name: { official } = {},
  flags: { svg } = {},
} = {}) {
  const markUp = `<li> <img src=${svg} width = "25"/> ${official}</li>`;
  refs.countryList.insertAdjacentHTML('beforeend', markUp);
}

function createCoutryDetailsMarkUp({
  name: { official } = {},
  flags: { svg } = {},
  capital = '',
  population = '',
  languages = [],
} = {}) {
  const language = Object.values(languages).join(', ');
  refs.countryInfo.innerHTML = `<img src=${svg} width = "25"/> <span>${official}</span> <p>Capital: ${capital}</p> <p> Population ${population}</p> <p>Languages ${language} </p>`;
}

function clearMarkUp() {
  refs.countryList.innerHTML = ``;
  refs.countryInfo.innerHTML = ``;
}
