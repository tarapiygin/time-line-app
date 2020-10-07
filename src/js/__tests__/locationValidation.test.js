import locationValidation from '../utils';

test('Test location validation', () => {
  expect(locationValidation('51.50851, -0.12572')).toBe(true);
  expect(locationValidation('51.50851,-0.12572')).toBe(true);
  expect(locationValidation('[51.50851, -0.12572]')).toBe(true);
});
