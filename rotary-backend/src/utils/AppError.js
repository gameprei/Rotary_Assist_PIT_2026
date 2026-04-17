// utils/AppError.js Classe de erro padrão
class AppError extends Error {
    constructor(message, statusCode = 400, details = null) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
        this.name = "AppError";
    }
}

export default AppError;