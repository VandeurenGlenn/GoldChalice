const map = {
    Foothills:
    {
        Grasslands:
        {
            directions: [ 'River', 'Woods', 'FarmHouse', 'OpenFields' ],
            itemsPresent: []
        },
        River:
        {
            directions: ['Grasslands', 'Woods', 'FarmHouse', 'OpenFields' ],
            itemsPresent: []
        },
        Woods:
        {
            directions: ['Grasslands', 'River', 'FarmHouse', 'OpenFields' ],

            itemsPresent: []
        },
        FarmHouse:
        {
            directions: ['Grasslands', 'River', 'Woods', 'OpenFields' ],
            itemsPresent: []
        },
        OpenFields:
        {
            directions: ['Grasslands', 'River', 'Woods', 'FarmHouse' ],
            itemsPresent: []
        }
    }    
};


module.exports = { map };