export interface UseAutocompleteFilterOptions {
  locale?: Intl.LocalesArgument
}

const normalize = (value: string, locale?: Intl.LocalesArgument) => {
  if (Array.isArray(locale)) {
    return value.toLocaleLowerCase(locale[0])
  }

  return value.toLocaleLowerCase(locale)
}

export function useAutocompleteFilter(options: UseAutocompleteFilterOptions = {}) {
  const normalizeValue = (value: string) => normalize(value, options.locale)

  const contains = (value: string, search: string) =>
    normalizeValue(value).includes(normalizeValue(search))

  const startsWith = (value: string, search: string) =>
    normalizeValue(value).startsWith(normalizeValue(search))

  const endsWith = (value: string, search: string) =>
    normalizeValue(value).endsWith(normalizeValue(search))

  return {
    contains,
    startsWith,
    endsWith,
  }
}
