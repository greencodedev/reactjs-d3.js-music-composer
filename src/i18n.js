/***
 * To Change website languages
 * 
 */
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Papa from 'papaparse';

export let LANGS = [];

i18n
  .use(LanguageDetector)
  .init({
    debug: false,
    ns: ['i18n'],
    defaultNS: 'i18n',
    keySeparator: false,
    interpolation: {
      escapeValue: false,
      formatSeparator: ','
    },
    react: {
      wait: true
    }
  });
/**
 * Translate Languages based on the browser language.
 */
const processLang = (langCode, data, done) => {
  const langData = {};

  LANGS.filter(ll => ll.key === langCode).forEach(ll => {
    ll.english_name = ll.english_name.trim();
    ll.local_name = ll.local_name.trim();

    langData['lang.english_name'] = ll.english_name;
    langData['lang.local_name'] = ll.local_name;
  });

  data.forEach(ll => {
    ll.OBJECT = (ll.OBJECT || '').trim();
    ll.LABEL = (ll.LABEL || '').trim();
    ll.TRANSLATE = (ll.TRANSLATE || '').trim();

    langData[`label.${ll.OBJECT}`] = ll.LABEL;
    langData[`help.${ll.OBJECT}`] = ll.TRANSLATE;
  });

  i18n.addResourceBundle(langCode, 'i18n', langData, true);

  done();
};

export const getLang = () => {
  return localStorage.getItem('i18nextLng') || 'en-US';
};
/**
 * Import language list from server.
 */
export const loadLang = (callback) => {
  const i18nextLng = getLang();

  const now = Date.now();
  const domain = document.location.origin;
  Papa.parse(`${domain}/txt/langs.txt?i=${now}`, {
    delimiter: '|',
    download: true,
    complete: function (results) {
      LANGS = results['data'].map(it => ({
        key: it[0], english_name: it[1], local_name: it[2]
      }));
      LANGS.sort((a, b) => a.local_name.localeCompare(b.local_name));

      let useLang = 'en-US';
      if (LANGS.some(lang => lang.key === i18nextLng)) {
        useLang = i18nextLng;
      }
      if (LANGS.some(lang => lang.key === i18nextLng.split('-')[0])) {
        useLang = i18nextLng.split('-')[0];
      }

      Papa.parse(`${domain}/txt/langs/${useLang}.txt?i=${now}`, {
        delimiter: '|',
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        download: true,
        complete: function (results) {
          if (!results) {
            callback();
          } else {
            processLang(useLang, results.data, () => {
              callback();
            });
          }
        }
      });
    }
  });


};

export default i18n;