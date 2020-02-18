import axios from 'axios';
import { key } from '../config';

export default class Recipe {
  constructor(id) {
    this.id = id;
  }

  async getRecipe() {
    try {
      const res = await axios(
        `https://api.spoonacular.com/recipes/${this.id}/information?apiKey=${key}`
      );
      this.title = res.data.title;
      this.image = res.data.image;
      this.source = res.data.sourceUrl;
      this.ingredients = res.data.extendedIngredients;
      this.cookingTime = res.data.cookingMinutes;
      this.servings = res.data.servings;
      console.log(res);

    } catch (error) {
      alert(error);
    }
  }

  parseIngredients() {
    const unitLong = ['tablespoons', 'tablespoon', 'teaspoon', 'teaspoons', 'cups', 'pounds', 'ounces', 'ounce'];
    const unitsShort = ['tbsp', 'tbsp', 'tsp', 'tsp', 'cup', 'pound', 'oz', 'oz'];
    this.ingredients.forEach(cur => {
      let ingredientUnit = cur.unit.toLowerCase();
      unitLong.forEach((unit, index) => {
        cur.unit = ingredientUnit.replace(unit, unitsShort[index]);
      });
    });
  }
}