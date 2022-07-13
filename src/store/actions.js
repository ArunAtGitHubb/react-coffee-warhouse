export const CHANGE_LANGUAGE = "change language"
export const CHANGE_PROFILE = "change profile"

export const onLanguageChange = (localeId) => {
    return {
        type: CHANGE_LANGUAGE,
        localeId: localeId
    }
}


export const onProfileChange = (dataItem) => {
    console.log(dataItem)
    return {
        type: CHANGE_PROFILE,
        dataItem: dataItem
    }
}
