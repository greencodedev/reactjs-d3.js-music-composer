const parseHelpMultilingual = (txt) => {
  const result = {};

  txt
    .split('\n')
    .filter(str => !!str.trim())
    .forEach(str => {
      str = str.trim().split('|');

      const langCode = str[0];
      const object = str[1];
      const label = str[2];
      const help = str[3];

      if (langCode === 'LANGUAGE') {
        return;
      }

      if (!result[langCode]) {
        result[langCode] = { i18n: {} };
      }

      result[langCode]['i18n'][`label.${object}`] = label;
      result[langCode]['i18n'][`help.${object}`] = help;
    })

  return result;
};

const parseGraphConfigMultilingual = (txt) => {
  const graphLang = {};
  const graphData = [];

  txt
    .split('\n')
    .filter(t => !!t.trim())
    .forEach(str => {
      str = str.trim().split('|');

      const langCode = str[1];
      const name = str[0];
      const label = str[2];
      const connType = str[9];
      const help = str[10] || '';

      if (langCode === 'LANGUAGE') {
        return;
      }

      if (!graphLang[langCode]) {
        graphLang[langCode] = { i18n: {} };
      }

      graphLang[langCode]['i18n'][`label.graph.${name}`] = label;
      graphLang[langCode]['i18n'][`help.graph.${name}`] = help;

      if (langCode === 'en-US') {
        graphData.push({
          name,
          label,
          sortOrder: +str[3],
          settings: {
            connType,
            minY: +str[4] || 0,
            maxY: +str[5] || 100,
            startY: +str[6] || 50,
            yStep: +str[7] || 1,
            ySymbol: str[8] || ''
          }
        });
      }
    });

  return { graphData, graphLang };
};

const parseLanguagesSupported = (txt) => {        // language support is generated from txt folder /langs.txt
  const result = {};

  txt
    .split('\n')
    .filter(str => !!str.trim())
    .forEach(str => {
      str = str.trim().split('|');

      const langCode = str[0];
      const nameEnglish = str[1];
      const nameLocal = str[2];

      if (langCode === 'CODE') {                  // ??
        return;
      }

      if (!result[langCode]) {
        result[langCode] = { i18n: {} };
      }

      result[langCode]['i18n']['lang.english_name'] = nameEnglish;
      result[langCode]['i18n']['lang.local_name'] = nameLocal;
    })

  return result;
};

const parseProjectData = (txt) => {
  const result = {};

  txt
    .split('\n')
    .filter(str => !!str.trim())
    .map(str => str.trim())
    .filter(str => str)
    .forEach(str => {
      str = str.trim().split(':').map(t => t.trim());
      const key = str[0];
      let value = str[1];

      if (value.includes('|')) {
        value = value.split('|').map(v => v.split(',').map(vv => +vv));
      }

      result[key] = value;
    });

  return result;
};

export default {
  parseHelpMultilingual,
  parseGraphConfigMultilingual,
  parseLanguagesSupported,
  parseProjectData
};