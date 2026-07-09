class AppError extends Error {
    statusCode: number;
    details?: any;

    constructor(statusCode: number, message: string, details?: any) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
        this.name = "AppError";
    }
}

export default AppError;