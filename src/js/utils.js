const regexp = /^(\[)?(?<latitude>-?\d{1,2}\.\d{5,}),\s?(?<longitude>-?\d{1,2}\.\d{5,})(\])?$/;

export default function locationValidation(str) {
  return regexp.test(str);
}

export function locationParse(str) {
  const { groups } = str.match(regexp);
  return groups;
}
