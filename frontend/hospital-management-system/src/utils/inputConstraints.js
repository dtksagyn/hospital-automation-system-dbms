export function filterNameInput(value) {
  return value.replace(/[0-9]/g, '');
}

export function filterPhoneInput(value) {
  return value.replace(/[a-zA-Z]/g, '');
}
