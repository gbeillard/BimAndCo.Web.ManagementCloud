export const getMappingCultures = ({ cultures, languages, languageCode }) => {
    const currentFound = cultures.find(({ Code }) => Code === languageCode);

    if (currentFound) return cultures;

    const foundLanguage = languages.find(({ LanguageCode }) => LanguageCode === languageCode);

    return [
        ...cultures, 
        { 
            Code: foundLanguage.LanguageCode, 
            Name: foundLanguage.Translations[languageCode], 
            Id: foundLanguage.LanguageCode,
     }]
}