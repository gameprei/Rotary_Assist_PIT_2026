class ApiResponse {
    static success(data, message = "Operação realizada com sucesso") {
        return {
            status: "success",
            message,
            data
        };
    }

    static error(message = "Erro interno do servidor", details = null) {
        return {
            status: "error",
            message,
            details,
        };
    }
}

export default ApiResponse;