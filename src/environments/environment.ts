export const environment = {
    BACKEND_URL: 'https://easy-store.back.jonatan-projects.com',
    BACKEND_PATH: '/api/v1',
    // El backend expone /auth (login, register, reset-password) SIN el
    // prefijo /api/v1, a diferencia del resto de endpoints. Esta constante
    // deja esa diferencia explicita en vez de que SecurityService use
    // BACKEND_URL "a secas" sin ninguna explicacion de por que no lleva
    // BACKEND_PATH como todos los demas servicios.
    AUTH_PATH: '/auth',
    DEFAULT_ROLE: { id: 1, name: 'client' },
    DEFAULT_IMAGE_PRODUCT_NAME: 'product.png',
    DEFAULT_IMAGE_CATEGORY_NAME: 'store.png'
};
