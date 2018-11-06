const doubleDigit = number => {
  if (number < 10) {
    return `0${number}`;
  } else {
    return number;
  }
}

const getTimeString = currentSecond => {
  const min = Math.floor(currentSecond / 60);
  const sec = currentSecond % 60;
  return `${doubleDigit(min)}:${doubleDigit(sec)}`;
};


export { doubleDigit, getTimeString };