const dictionary = require('../data/dictionary');

function translator(dictionary, input) {
  const words = input.split(' ');

  const translated = words.map(word => {
    if (dictionary[word]) {
      return dictionary[word];
    }
    return word;
  }).join(' ');
  
  return translated;
}
