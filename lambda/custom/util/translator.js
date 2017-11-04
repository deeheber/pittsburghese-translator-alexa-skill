module.exports = (dictionary, phrase) => {
  const words = phrase.split(' ');

  return words
    .map(word => {
      if (dictionary[word]) {
        return dictionary[word];
      }
      return word;
    })
    .join(' ');
}
