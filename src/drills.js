require('dotenv').config();
const knex = require('knex');

const knexInstance = knex({
    client: 'pg',
    connection: process.env.DB_URL
});

console.log('knex and driver installed correctly');

function searchByTerm(searchTerm) {
    knexInstance
        .select('*')
        .from('shopping_list')
        .where('name', 'ILIKE', `%${searchTerm}%`)
        .then(result => {
            console.log('Search Term:', { searchTerm });
            console.log(result);
        });
}

searchByTerm('carrot');

function paginateItems(page) {
    const itemsPerPage = 6;
    const offset = itemsPerPage * (page - 1)
    knexInstance
        .select('*')
        .from('shopping_list')
        .limit(limit)
        .offset(offset)
        .then(result => {
            console.log('Paginate Items', { page });
            console.log(result);
        });
}

paginateItems(3);

function getItemsAfterDate(days) {
    knexInstance
        .select('*')
        .from('shopping_list')
        .where(
            'date_added',
            '>',
            //raw to pass in SQL as a string, ?? tells knex that
            //this is the position in the eaw SQL that will contain
            //user input, then specify value for user input as second
            //argument to raw()
            knexInstance.raw(`now() - '?? days'::INTERVAL`, days)
        )
        .then(result => {
            console.log('Items Added Days Ago');
            console.log(result);
        });
}

getItemsAfterDate(2);

function costPerCategory() {
    knexInstance
        .select('category')
        .from('shopping_list')
        .groupBy('category')
        .sum('price AS total')
        .then(result => {
            console.log('Cost Per Category')
            console.log(result);
        });
}

costPerCategory();