import './css/styles.css';
import Notiflix from 'notiflix';
import { fetchCountries } from './js/fetchCountries';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const refs = {
  searchFormEl: document.querySelector('input#search-box'),
  countryListEl: document.querySelector('.country-list'),
  countryInfoEl: document.querySelector('.country-info'),
};

refs.searchFormEl.addEventListener(
  'input',
  debounce(onSearchFormCountry, DEBOUNCE_DELAY)
);

function onSearchFormCountry(event) {
  event.preventDefault();

  let searchedNameCountry = event.target.value.trim();

  if (searchedNameCountry === '') {
    clearMarkup();
    return;
  } else
    fetchCountries(searchedNameCountry)
      .then(responce => {
        if (responce.length === 1) {
          clearMarkup();
          renderFullCountryMarkup(responce);
        } else if (responce.length > 1 && responce.length < 10) {
          clearMarkup();
          renderCountryList(responce);
        } else {
          clearMarkup();
          Notiflix.Notify.info(
            'Too many matches found. Please enter a more specific name'
          );
        }
      })
      .catch(() => {
        clearMarkup();
        Notiflix.Report.failure('OOps, there is no country with that name');
      });

  function renderCountryList(country) {
    clearMarkup();
    const countryMarkup = country
      .map(item => {
        return `
            <li class="country-list-item">
                <img class="flag-svg"
                    src="${item.flags.svg}"
                    alt="flag"
                    width=80
                />
                <p class="country-name">${item.name}</p>
            </li>`;
      })
      .join('');
    refs.countryListEl.insertAdjacentHTML('beforeend', countryMarkup);
  }

  function renderFullCountryMarkup(country) {
    clearMarkup();
    const languages = Object.values(country[0].languages)
      .map(el => el.name)
      .join(', ');
    const countryFullMarkup = `
<img
class="flag"
src="${country[0].flags.svg}"
alt="country flag"
width=100
/>
<h1>${country[0].name}</h1>
<p>Capital: <span class="country-value">${country[0].capital}</span></p>
<p>Population: <span class="country-value">${country[0].population}</span></p>
<p>Languages: <span class="country-value">${languages}</span></p>
`;
    refs.countryInfoEl.innerHTML = countryFullMarkup;
  }
}

function clearMarkup() {
  refs.countryInfoEl.innerHTML = '';
  refs.countryListEl.innerHTML = '';
}
