/**
 * Funkcja wstawia element do posortowanej tablicy zachowując porządek sortowania
 *
 * @template T - Typ obiektów przechowywanych w tablicy (musi dziedziczyć po Object)
 * @param {T[]} arr - Tablica, do której ma zostać dodany element
 * @param {T} elem - Element do dodania
 * @param {keyof T} key - Klucz obiektu, według którego odbywa się sortowanie
 * @returns {T[]} - Tablica z dodanym elementem
 */
export function sortedPush<T extends Object>(arr: T[], elem: T, key: keyof T) {
  // Przeszukujemy tablicę w poszukiwaniu miejsca do wstawienia elementu
  for (let i = 0; i < arr.length; i++) {
    // Jeśli znaleźliśmy element większy od wstawianego
    if (arr[i][key] > elem[key]) {
      // Wstawiamy nowy element przed znalezionym elementem
      arr.splice(i, 0, elem);
      return arr;
    }
  }
  // Jeśli nie znaleziono większego elementu, dodajemy na koniec tablicy
  arr.push(elem);
  return arr;
}
