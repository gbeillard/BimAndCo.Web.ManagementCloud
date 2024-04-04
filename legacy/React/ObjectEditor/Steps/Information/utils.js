const EN = "en";

export const getDefaultLanguageOption = (cultures, languageCode) => {
    const currentFound = cultures.find(({ Code }) => Code === languageCode);

    if (currentFound) return currentFound.Code;

    const enFound = cultures.find(({ Code }) => Code === EN);

    if (enFound) return enFound.Code;

    return ""
}   


export const getAvaibleCulturesEdit = ({cultures, languages, currentCulture, languageCode }) => {
    if(!currentCulture) return cultures;

    const currentFound = cultures.find(({ Code }) => Code === currentCulture.language);

    if (currentFound) return cultures;

    const foundLanguage = languages.find(({ LanguageCode }) => LanguageCode === currentCulture.language);

    return [
        ...cultures, 
        { 
            Code: currentCulture.language, 
            Name: foundLanguage?.Translations[languageCode], 
            Id: currentCulture.language,
     }]
}


export const resolveDistributionCountries = ({ countries = [], selectedCountries = [] }) => {
    if(!selectedCountries) return countries;

    const missingSelectedCountries = selectedCountries
        .filter(({ Iso }) => !countries.find(({ Code }) => Code === Iso))
        .map(({ Id, Iso, Name}) => ({ Id, Code: Iso, Name }));

    return [
        ...countries, 
        ...missingSelectedCountries
    ]
}