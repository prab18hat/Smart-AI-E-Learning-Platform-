export const paths = {
    models: '../models',
    controllers: '../controllers',
    middlewares: '../middlewares',
    routes: '../routes',
    database: '../database'
};

// Create an import function for dynamic imports
export const importModule = async (path) => {
    return import(path);
};
