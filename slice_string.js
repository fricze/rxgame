const sliceString = {
  left: (string) => ({
    string: string.slice(1),
    // nextTransformation: sliceFromBorder.right,
    nextTransformation: sliceString.left,
    // nextGoal: string[string.length - 1]
    nextGoal: string[1]
  }),
  right: (string) => ({
    string: string.slice(0, -1),
    nextTransformation: sliceString.left,
    nextGoal: string[0]
  })
};

export default sliceString;
