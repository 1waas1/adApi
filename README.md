# adApi
start:

`docker-compose up -d`

`node src/services/CreatedTable`

##API
get `/list`
+ Json params:
    + page (int) required
    + field (string) `data/price`
    + params (string) `asc/desc`


get `/ads/:id`
+ Json params:
    + fields (array) `['description', 'images']`
    
post `/create`
+ Json params:
    + fields (object) `{'field': 'value', 'field': 'value' ...}`
