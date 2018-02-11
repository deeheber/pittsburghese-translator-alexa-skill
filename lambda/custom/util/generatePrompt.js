module.exports = prompts => {
  const min = 0;
  const max = prompts.length - 1;
  const index = Math.floor(Math.random() * (max - min + 1)) + min;

  return prompts[index];
};