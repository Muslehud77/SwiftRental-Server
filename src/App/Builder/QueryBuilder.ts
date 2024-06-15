import { FilterQuery, Query, model } from "mongoose";


export class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    (this.modelQuery = modelQuery), (this.query = query);
  }

  search(searchableFields: string[]) {
    const { searchTerm } = this?.query;
    if (searchTerm) {
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map(
          field =>
            ({
              [field]: { $regex: searchTerm, $options: 'i' },
            }) as FilterQuery<T>,
        ),
      });
    }
    return this;
  }

  filter() {
    const { searchTerm, sort, limit, page, fields, ...queryObject } =
      this?.query;

      if(queryObject.carId){
        queryObject.car = queryObject.carId; // Add new key with the same value
        delete queryObject.carId; // Remove the old key
      }

      console.log(queryObject);

    this.modelQuery = this.modelQuery.find(queryObject as FilterQuery<T>);

    return this;
  }

  sort() {
    const { sort } = this?.query;

    const sorting = sort
      ? (sort as string)?.split(',').join(' ')
      : '-createdAt';

    this.modelQuery = this.modelQuery.sort(sorting);

    return this;
  }

  paginate() {
    const { page, limit } = this?.query;
    const pageNumber = Number(page as string) || 1;
    const limitDataCount = Number(limit as string) || 0;
    const skip = page ? (pageNumber - 1) * limitDataCount : 0;

    this.modelQuery = this.modelQuery.skip(skip).limit(limitDataCount);
    return this;
  }

  fieldQuery() {
    const { fields } = this?.query;
    // Define the fields to show in the result, defaulting to excluding '__v' if not provided
    const fieldsToShow = fields
      ? (fields as string)?.split(',').join(' ')
      : '-__v';

    // Select only the specified fields in the final query
    this.modelQuery = this.modelQuery.select(fieldsToShow);

    return this;
  }
}

 