

class APIFilters {

    constructor(query, queryString){
        this.query = query;
        this.queryString = queryString;
    }

    search(){
        const keyword = this.queryString.keyword ? {
            name:{
                $regex:this.queryString.keyword,
                $options:'i'
            }
        } : {};

        this.query = this.query.find({...keyword});

        return this;
    }

    filters(){
        const queryCopy = {...this.queryString};

        console.log("Original query: " , this.queryString);

        const fieldToRemove = ['keyword','page'];
        fieldToRemove.forEach((el) => delete queryCopy[el]);

        // Advance filter for price, ratings etc
        let queryStr = JSON.stringify(queryCopy)
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`)

        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    pagination(resPerPage){
        const currentPage = Number(this.queryString.page) || 1;
        const skip = resPerPage * (currentPage -1);
        
        this.query = this.query.limit(resPerPage).skip(skip);

        return this;
    }
}

export default APIFilters;