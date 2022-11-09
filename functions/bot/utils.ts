export const printIngredients = (ingredients: Ingredient[]) => {
  const ingredientText = ingredients.map(({ nameClean, measures }) => {
    if (measures.us.unitShort === measures.metric.unitShort)
      return `${measures.us.amount} ${measures.us.unitShort} ${nameClean}`;
    return `${measures.metric.amount} ${measures.metric.unitShort} (${measures.us.amount} ${measures.us.unitShort}) ${nameClean}`;
  });
  return ingredientText.join('\n');
};

export const printInstructions = (
  instructions: { name: string; steps: InstructionStep[] }[]
) => {
  return instructions.reduce(
    (acc, { steps }) =>
      acc +
      steps.reduce((acc, curr) => {
        if (curr.length)
          return (
            acc +
            `\n${curr.number} - (${curr.length.number} ${curr.length.unit}) ${curr.step}`
          );
        else return acc + `\n${curr.number} - ${curr.step}`;
      }, ''),
    ''
  );
};
