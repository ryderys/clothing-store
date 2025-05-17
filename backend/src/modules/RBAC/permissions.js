const permissions = Object.freeze({
    product: {
        create: ['admin'],
        read: ['admin', 'user', 'guest'],
        update: ['admin'],
        delete: ['admin']
    },
    category: {
        create: ['admin'],
        read: ['admin'],
        delete: ['admin']
    },
    review: {
        create: ['admin', 'user'],
        read: ['admin', 'user', 'guest'],
        update: ['admin', 'user'],
        updateOwn: ['user'],
        delete: ['admin'],
        deleteOwn: ['user']
    },
    features: {
        create: ['admin'],
        read: ['admin'],
        update: ['admin'],
        delete: ['admin']
    },
    order: {
        create: ['user'],
        read: ['admin'],
        update: ['admin'],
        updateOwn: ['user'], // This allows users to update their own orders
        readOwn: ['user'],  //this allows users to read their own orders
        delete: ['admin']
    },
    cart: {
        create: ['user'], // This allows users to read their own cart
        readOwn: ['user'], // This allows users to read their own cart
        updateOwn: ['user'] // This allows users to update their own cart
    },
    savedItems: {
        create: ['user'], 
        readOwn: ['user'], 
        updateOwn: ['user'] 
    },
    users: {
        create: ['admin'],
        readOwn: ['user'],
        read: ['admin'],
        update: ['admin'],
        updateOwn: ['user'], //users can update their own profile 
        delete: ['admin']
    }
})

module.exports = permissions;