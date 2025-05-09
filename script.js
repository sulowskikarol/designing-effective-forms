let clickCount = 0;
let countrySelect;

const countryInput = document.getElementById('country');
const myForm = document.getElementById('form');
const modal = document.getElementById('form-feedback-modal');
const clicksInfo = document.getElementById('click-count');

function handleClick() {
    clickCount++;
    clicksInfo.innerText = clickCount;
}

async function fetchAndFillCountries() {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        if (!response.ok) {
            throw new Error('Błąd pobierania danych');
        }
        const data = await response.json();
        const countries = data.map(country => country.name.common);
        countryInput.innerHTML = countries.map(country => `<option value="${country}">${country}</option>`).join('');
    
        if (!countrySelect) {
            countrySelect = new TomSelect('#country', {
                create: false,
                sortField: {
                    field: "text",
                    direction: "asc"
                },
                placeholder: "Wybierz kraj",
                allowEmptyOption: true,
            });
            getCountryByIP();
        }
    } catch (error) {
        console.error('Wystąpił błąd:', error);
    }
}

function getCountryByIP() {
    fetch('https://get.geojs.io/v1/ip/geo.json')
        .then(response => response.json())
        .then(data => {
            const country = data.country;
            if (countrySelect) {
                const exists = Object.values(countrySelect.options).some(
                    opt => opt.value.toLowerCase() === country.toLowerCase()
                );
                if (exists) {
                    countrySelect.setValue(country);
                    getCountryCode(country);
                }
            }
        })
        .catch(error => {
            console.error('Błąd pobierania danych z serwera GeoJS:', error);
        });
}

function getCountryCode(countryName) {
    const apiUrl = `https://restcountries.com/v3.1/name/${countryName}?fullText=true`;

    fetch(apiUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error('Błąd pobierania danych');
        }
        return response.json();
    })
    .then(data => {        
        const countryCode = data[0].idd.root + data[0].idd.suffixes.join("")
        const select = document.getElementById("countryCode");
        for (let option of select.options) {
            if (option.value.includes(countryCode)) {
                option.selected = true;
                break;
            }
        }
    })
    .catch(error => {
        console.error('Wystąpił błąd:', error);
    });
}

myForm.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        myForm.requestSubmit();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const vatCheckbox = document.getElementById('vatUE');
    const vatFields = document.getElementById('vatFields');

    vatCheckbox.addEventListener('change', () => {
        vatFields.style.display = vatCheckbox.checked ? 'block' : 'none';
    });
});

(() => {
    // nasłuchiwania na zdarzenie kliknięcia myszką
    document.addEventListener('click', handleClick);

    fetchAndFillCountries();
})()
