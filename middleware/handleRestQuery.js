const handleQuery = (req, res, next) =>{
    let query = {...req.query};
    let projection, logicalOperator = null;
    query = JSON.stringify(query);

    //*Add $sign to each of the logical operators
    query = query.replace(/\b(lt|lte|gt|gte)\b/g, (match) =>{
        logicalOperator = "$"+match
        return "$"+match
    });
    query = JSON.parse(query);

    //*Convert score string value to integer value
    if(query['grades.score']){
        if(typeof (query['grades.score']) === 'object' && query['grades.score'] !== null){
            query['grades.score'][logicalOperator] = parseInt(query['grades.score'][logicalOperator]);
        }
        else{
            query['grades.score'] = parseInt(query['grades.score']);
        }
    }

    //*if query.only(projection) exists than assign the appropriate fields
    //*from query.only to a projection object
    if(query.only){
        const topFields = [{address:1},{borough:1},{cuisine:1},{grades:1},{name:1},{restaurantId:1}];
        const queryFields = query.only.split(',');
        const projectionArray = [{_id:0}];

        queryFields.forEach(field => {
            topFields.forEach(topField => {
                if (field == Object.keys(topField)[0]) {
                    projectionArray.push(topField)
                }   
            });
        });
        projection = Object.assign({}, ...projectionArray);
    }

    const removeFields = ['only', 'limit', 'page'];
    removeFields.forEach(field => {
        delete query[field];
    });

    req.filter = query;
    req.projection = projection;
    next();
}

module.exports = handleQuery;