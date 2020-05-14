import { Injectable } from '@angular/core';
import { Dish } from '../shared/dish';
import { DISHES, DISHES } from '../shared/dishes';

@Injectable({
  providedIn: 'root'
})
export class DishService {

  constructor() { }

  getDish(): Dish[] {
    return DISHES
  }

  getD(id: string): Dish{
    return DISHES.filter((dish) => {dish.id === id})[0]
  }

  getFeaturedDish(): Dish {
    return DISHES.filter((dish) => dish.featured)[0]
  }
}
