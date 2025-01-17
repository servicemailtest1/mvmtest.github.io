let localizationPath = window.location.pathname.includes("/services/") ? "../assets/locales/" : "assets/locales/";
let assetsPath = window.location.pathname.includes("/services/") ? "../assets/" : "assets/";

window.addEventListener('load', function () {
    // Dil kontrolü: localStorage -> sistem dili -> varsayılan 'tr'
    let localLanguage = localStorage.getItem('language');
    let systemLanguage = navigator.language.slice(0, 2);
    let initialLanguage = 'tr';

    if (localLanguage) {
        initialLanguage = localLanguage;
    }
    else {
        initialLanguage = systemLanguage;
        localStorage.setItem('language', initialLanguage);
    }


    // Desteklenmeyen bir dil kodu geldiyse varsayılan olarak 'tr' kullan
    if (!['tr', 'en'].includes(initialLanguage)) {
        initialLanguage = 'tr';
        localStorage.setItem('language', initialLanguage);
    }

    // JSON dosyalarını fetch ile yükle
    Promise.all([
        fetch(localizationPath + 'tr.json').then(res => res.json()),
        fetch(localizationPath + 'en.json').then(res => res.json())
    ]).then(([tr, en]) => {
        // i18next'i başlat
        i18next.init({
            lng: initialLanguage, // Başlangıç dili
            debug: true,
            resources: {
                en: { translation: en },
                tr: { translation: tr }
            }
        }, function (err, t) {
            if (err) {
                console.error('i18next başlatılamadı:', err);
                return;
            }
            updateContent();
            updateFlag();
        });
    }).catch(err => console.error('Dil dosyaları yüklenemedi:', err));
});

document.addEventListener('click', (e) => {
    const languageSelector = document.querySelector('.language-selector');
    const languageButton = document.getElementById('languageButton');

    // Eğer tıklanan eleman languageButton veya dropdown'un içi değilse kapat
    if (!languageButton.contains(e.target) && !languageSelector.contains(e.target)) {
        languageSelector.classList.remove('active');
    }
});

// HTML içeriğini güncelleyen fonksiyon
function updateContent() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        element.textContent = i18next.t(key);
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(element => {
        const key = element.getAttribute("data-i18n-placeholder");
        element.setAttribute("placeholder", i18next.t(key));
    });
}

function updateFlag() {
    const selectedFlag = document.getElementById('selectedFlag');
    const currentLanguage = i18next.language;

    // Dil koduna göre bayrak ikonu belirle
    if (currentLanguage === 'en') {
        selectedFlag.src = assetsPath + 'img/flags/united-kingdom.svg';
        selectedFlag.alt = 'English';
    } else if (currentLanguage === 'tr') {
        selectedFlag.src = assetsPath + 'img/flags/turkey.svg';
        selectedFlag.alt = 'Türkçe';
    }
}

function toggleLanguageDropdown() {
    document.querySelector('.language-selector').classList.toggle('active');
}

function changeLanguage(newLanguage) {
    i18next.changeLanguage(newLanguage, function (err) {
        if (err) {
            console.error('Dil değiştirilemedi:', err);
            return;
        }
        updateContent();
        updateFlag();
        localStorage.setItem('language', newLanguage); // Seçilen dili localStorage'a kaydet
    });

    // Dropdown'ı kapat
    document.querySelector('.language-selector').classList.remove('active');
}
