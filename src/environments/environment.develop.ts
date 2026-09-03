export const environment = {
    BACKEND_URL: 'http://localhost:8081',
    BACKEND_PATH: '/api/v1',
    // Ver comentario en environment.ts: /auth no lleva el prefijo /api/v1.
    AUTH_PATH: '/auth',
    DEFAULT_ROLE: { id: 1, name: 'client' },
    DEFAULT_IMAGE_PRODUCT_NAME: 'product.png',
    DEFAULT_IMAGE_CATEGORY_NAME: 'store.png'
};
