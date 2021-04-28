export const LANGUAGE_CHANGE = 'LANGUAGE_CHANGE';

export function changeLanguage(lang) {
  return {
    type: LANGUAGE_CHANGE,
    payload: lang
  }
}