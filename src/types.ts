type Measures = {
    amount: number,
    unitShort: string,
}

type MeasureKey = "us" | "metric";

type Ingredient = {
    "id": number,
    "nameClean": string,
    "measures": Record<MeasureKey, Measures>
}

type InstructionStep = {
    number: number,
    step: string,
    length?: { number: number, unit: string },
}

type Recipe = {
    "title": string,
    "analyzedInstructions": { name: string, steps: InstructionStep[] }[],
    "sourceUrl": string,
    "extendedIngredients": Ingredient[],
}