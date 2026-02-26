const API_URL = "http://localhost:3000/api";

class ApiService {
  static async HandleResponse(response) {
    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ error: "Erro ao processar resposta" }));
      throw new Error(errorData.message || `Erro HTTP ${response.status}`);
    }
    return response.json();
  }

  static async get(endpoint) {
    try {
      const response = await fetch(`${API_URL}/${endpoint}`);
      return await this.HandleResponse(response);
    } catch (error) {
      console.error("Erro na requisição GET:", error);
      throw error;
    }
  }

  static async post(endpoint, data) {
    try {
      const response = await fetch(`${API_URL}/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      return await this.HandleResponse(response);
    } catch (error) {
      console.error("Erro na requisição POST:", error);
      throw error;
    }
  }

  static async put(endpoint, data) {
    try {
      const response = await fetch(`${API_URL}/${endpoint}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      return await this.HandleResponse(response);
    } catch (error) {
      console.error("Erro na requisição PUT:", error);
      throw error;
    }
  }

  static async delete(endpoint) {
    try {
      const response = await fetch(`${API_URL}/${endpoint}`, {
        method: "DELETE",
      });
      return await this.HandleResponse(response);
    } catch (error) {
      console.error("Erro na requisição DELETE:", error);
      throw error;
    }
  }
}

export default ApiService;
