export const resolveModelLanguages = ({ availableLanguages, cultures, languages, currentLanguage, languageCode }) => {
    const availableCultures = cultures.filter(({ Code }) => availableLanguages.includes(Code));

    const foundCurrentLanguage = availableCultures.find(({ Code }) => Code === currentLanguage);

    if(foundCurrentLanguage) return availableCultures;

    const language = languages.find(({ LanguageCode }) => LanguageCode === currentLanguage);

    return [
        ...availableCultures,
        {
            Name: language?.Translations[languageCode],
            Code: currentLanguage,
            Id: currentLanguage,
        }
    ]
}