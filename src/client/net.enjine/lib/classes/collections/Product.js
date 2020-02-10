import Collection from "./Collection";
import ProductModel from "lib/classes/models/Product";

export default class ProductCollection extends Collection {
  constructor(data = [], options = {}) {
    super(
      data,
      Object.assign({ modelClass: options.modelClass || ProductModel }, options)
    );
  }
}
