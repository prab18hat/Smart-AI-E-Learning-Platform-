export const paths = {
    models: new URL('../models', import.meta.url).pathname,
    controllers: new URL('../controllers', import.meta.url).pathname,
    middlewares: new URL('../middlewares', import.meta.url).pathname,
    routes: new URL('../routes', import.meta.url).pathname,
    database: new URL('../database', import.meta.url).pathname
};
