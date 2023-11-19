import { AppSettings } from "appsettings-json-reader";

export const environment = {
    BACKEND_URL: AppSettings.readAppSettings().backendUrl,
    BACKEND_PATH: AppSettings.readAppSettings().backendPath,
    CRYPTO_KEY: AppSettings.readAppSettings().cryptoKey
};
