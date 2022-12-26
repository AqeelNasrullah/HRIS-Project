class ApiFatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }
  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};
    this.query = this.query.find({ ...keyword });
    return this;
  }
  filter() {
    const filteredQuery = { ...this.queryStr };
    const removedFields = ["keyword", "page", "limit"];
    removedFields.forEach((key) => delete filteredQuery[key]);

    //converting to string
    let queryJson = JSON.stringify(filteredQuery);
    queryJson = queryJson.replace(/\b(lt|lte|gt|gte)\b/g, (key) => `$${key}`);
    
    this.query = this.query.find(JSON.parse(queryJson));
    return this;
  }
  pagination(resultPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resultPerPage * (currentPage - 1);
    this.query = this.query.limit(resultPerPage).skip(skip);
    return this;
  }
}

module.exports = ApiFatures;
