const getRandomByRange = ([min, max]: number[]) => {
  return Math.random() * (min - max) + max
}

export default getRandomByRange
