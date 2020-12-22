module.exports = (dictionary, phrase) => {
  const words = phrase.split(' ');
  const result = [];

  for (let i = 0; i < words.length; i++) {
    const currentWord = words[i];
    const nextWord = words[i + 1];

    if (dictionary[`${currentWord}_${nextWord}`]) {
      // two word phrase match
      result.push(dictionary[`${currentWord}_${nextWord}`]);
      i++;
    } else if (dictionary[currentWord]) {
      // single word phrase match
      result.push(dictionary[currentWord]);
    } else {
      // no word match, so return the word as is
      result.push(words[i]);
    }
  }

  return result.join(' ');
}
