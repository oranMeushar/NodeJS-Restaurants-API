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


    //*parseInt the fields age, latitude, longitude
    if (query['latitude']) {
        query['latitude'] = parseFloat(query['latitude']);
    }
    if (query['longitude']) {
        query['longitude'] = parseFloat(query['longitude']);
    }
    
    if(query['age']){
        if(typeof (query['age']) === 'object' && query['age'] !== null){
            query['age'][logicalOperator] = parseInt(query['age'][logicalOperator]);
        }
        else{
            query['age'] = parseInt(query['age']);
        }
    }

    //*if query.only(projection) exists than assign the appropriate fields
    //*from query.only to a projection object
    if(query.only){
        const topFields = [
            {index:1},{balance:1},{age:1},{name:1},{gender:1},{email:1},
            {phone:1}, {address:1}, {registered:1}, {emergencyContacts:1}, {latitude:1},
            {longitude:1}, {favoriteFruit:1}, {restaurants:1}
        ];
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
        delete query['only'];
    }

    req.filter = query;
    req.projection = projection;
    next();
}

module.exports = handleQuery;