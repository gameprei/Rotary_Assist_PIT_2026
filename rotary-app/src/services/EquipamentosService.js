// services/EquipamentosService.js
import ApiService from "./ApiService.js";

class EquipamentosService {
  // Funções para aplicar formatações ao carregar dados do back para o front

  // Função para formatar data SQL para formato brasileiro (se necessário)
  formatarDataParaFront(data) {
    if (!data) return "";
    // Remove hora se existir
    const dataSemHora = data.split("T")[0];
    // Converte aaaa-mm-dd para dd/mm/aaaa (caso queira mostrar no formato brasileiro)
    // Mas como o input é type="date", talvez seja melhor manter ISO
    return dataSemHora;
  }

  // Função para formatar data do front (dd/mm/aaaa) para o banco (aaaa-mm-dd)
  formatarDataParaBack(data) {
    if (!data) return "";
    // Se a data já estiver no formato ISO (aaaa-mm-dd), mantém
    if (/^\d{4}-\d{2}-\d{2}$/.test(data)) {
      return data;
    }
    // Se estiver no formato brasileiro (dd/mm/aaaa), converte
    const partes = data.split('/');
    if (partes.length === 3) {
      return `${partes[2]}-${partes[1]}-${partes[0]}`;
    }
    return data;
  }

  // Listar todos os equipamentos
  async listarTodos() {
    try {
      const resposta = await ApiService.get("equipamentos");
      
      // Normaliza para array
      let dados = [];
      if (Array.isArray(resposta)) {
        dados = resposta;
      } else if (resposta && typeof resposta === 'object') {
        // Se for um objeto, tenta extrair um array
        if (resposta.data && Array.isArray(resposta.data)) {
          dados = resposta.data;
        } else if (resposta.equipamentos && Array.isArray(resposta.equipamentos)) {
          dados = resposta.equipamentos;
        } else if (resposta.results && Array.isArray(resposta.results)) {
          dados = resposta.results;
        } else {
          dados = [resposta];
        }
      }

      // Converte cada linha da API para o formato que o front usa
      const equipamentosFormatados = dados.map((e) => {
        const equipamento = {
          nome: e.NOME || e.nome || "",
          patrimonio: e.PATRIMONIO || e.patrimonio || "",
          tipo: e.TIPO || e.tipo || "",
          estado_conservacao: e.ESTADO_CONSERVACAO || e.estado_conservacao || "",
          data_aquisicao: this.formatarDataParaFront(e.DATA_AQUISICAO || e.data_aquisicao || ""),
          descricao: e.DESCRICAO || e.descricao || "",
          // Campos adicionais que podem vir do banco
          created_at: e.CREATED_AT || e.created_at || "",
          updated_at: e.UPDATED_AT || e.updated_at || ""
        };
        
        return equipamento;
      });

      return equipamentosFormatados;
    } catch (error) {
      console.error("Erro ao listar equipamentos:", error);
      return [];
    }
  }

  // Buscar equipamento por patrimônio
  async buscarPorPatrimonio(patrimonio) {
    try {
      const equipamentos = await this.listarTodos();
      return equipamentos.find((equipamento) => 
        equipamento.patrimonio === patrimonio
      ) || null;
    } catch (error) {
      console.error("Erro ao buscar por patrimônio:", error);
      throw error;
    }
  }

  // Excluir equipamento por patrimônio
  async excluir(patrimonio) {
    try {
      return await ApiService.delete(`equipamentos/${patrimonio}`);
    } catch (error) {
      console.error("Erro ao excluir equipamento:", error);
      throw error;
    }
  }

  // Filtrar equipamentos por termo (nome, patrimônio, tipo ou estado)
  async filtrar(filtro) {
    try {
      const equipamentos = await this.listarTodos();
      const filtroLower = filtro.toLowerCase();

      return equipamentos.filter((equipamento) =>
        Object.values(equipamento).some(
          (value) =>
            value && value.toString().toLowerCase().includes(filtroLower)
        )
      );
    } catch (error) {
      console.error("Erro ao filtrar equipamentos:", error);
      throw error;
    }
  }

  // Cadastrar novo equipamento
  async cadastrar(equipamento) {
    try {
      // Verifica se já existe equipamento com mesmo patrimônio
      const equipamentoExistente = await this.buscarPorPatrimonio(equipamento.patrimonio);
      
      if (equipamentoExistente) {
        throw new Error("Patrimônio já cadastrado no sistema");
      }

      const equipamentoFormatado = {
        nome: equipamento.nome || "",
        patrimonio: equipamento.patrimonio || "",
        tipo: equipamento.tipo || "",
        estado_conservacao: equipamento.estado_conservacao || "",
        data_aquisicao: this.formatarDataParaBack(equipamento.data_aquisicao || ""),
        descricao: equipamento.descricao || ""
      };

      return await ApiService.post("equipamentos", equipamentoFormatado);
    } catch (error) {
      console.error("Erro ao cadastrar equipamento:", error);
      throw error;
    }
  }

  // Atualizar equipamento existente
  async atualizar(patrimonio, equipamento) {
    try {
      const equipamentoFormatado = {
        nome: equipamento.nome || "",
        patrimonio: equipamento.patrimonio || "",
        tipo: equipamento.tipo || "",
        estado_conservacao: equipamento.estado_conservacao || "",
        data_aquisicao: this.formatarDataParaBack(equipamento.data_aquisicao || ""),
        descricao: equipamento.descricao || ""
      };

      return await ApiService.put(`equipamentos/${patrimonio}`, equipamentoFormatado);
    } catch (error) {
      console.error("Erro ao atualizar equipamento:", error);
      throw error;
    }
  }
}

export default new EquipamentosService();