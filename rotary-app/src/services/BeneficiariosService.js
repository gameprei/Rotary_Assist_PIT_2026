import ApiService from "./ApiService.js";

class BeneficiariosService {
  //Funções para aplicar máscaras ao carregar dados do back para o front

  // Função para formatar data SQL para formato brasileiro
  formatarDataParaFront(data) {
    if (!data) return "";
    // Remove hora se existir
    const dataSemHora = data.split("T")[0];
    // Converte aaaa-mm-dd para dd/mm/aaaa
    return dataSemHora.replace(
      /^(\d{4})-(\d{2})-(\d{2})$/,
      (match, ano, mes, dia) => `${dia}/${mes}/${ano}`
    );
  }
  // Função para aplicar máscara de CPF
  aplicarMascaraCPF(cpf) {
    if (!cpf) return "";
    const cpfLimpo = cpf.replace(/\D/g, "");
    if (cpfLimpo.length === 11) {
      return cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }
    return cpf;
  }
  // Função para aplicar máscara de RG
  aplicarMascaraRG(rg) {
    if (!rg) return "";
    const rgLimpo = rg.replace(/\D/g, "");
    if (rgLimpo.length === 9) {
      return rgLimpo.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, "$1.$2.$3-$4");
    }
    return rg;
  }
  // Função para aplicar máscara de telefone
  aplicarMascaraTelefone(telefone) {
    if (!telefone) return "";
    const telLimpo = telefone.replace(/\D/g, "");
    if (telLimpo.length === 11) {
      return telLimpo.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    } else if (telLimpo.length === 10) {
      return telLimpo.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    }
    return telefone;
  }
  // Função para aplicar máscara de CEP
  aplicarMascaraCEP(cep) {
    if (!cep) return "";
    const cepLimpo = cep.replace(/\D/g, "");
    if (cepLimpo.length === 8) {
      return cepLimpo.replace(/(\d{5})(\d{3})/, "$1-$2");
    }
    return cep;
  }

  // Listar todos os beneficiários
  async listarTodos() {
    try {
      const resposta = await ApiService.get("beneficiarios");
      // Normaliza para array
      const dados = Array.isArray(resposta)
        ? resposta
        : resposta.data || resposta.beneficiarios || resposta.results || [];

      return dados.map((b) => ({
    nome: b.nome,
    cpf: this.aplicarMascaraCPF(b.cpf),
    rg: this.aplicarMascaraRG(b.rg), 
    data_nascimento: this.formatarDataParaFront(b.data_nascimento),
    telefone: this.aplicarMascaraTelefone(b.telefone), 
    email: b.email,
    endereco: b.endereco,
    bairro: b.bairro,
    cidade: b.cidade,
    uf: b.uf, 
    cep: this.aplicarMascaraCEP(b.cep), 
    contato_emergencia: b.contato_emergencia,
    telefone_emergencia: this.aplicarMascaraTelefone(b.telefone_emergencia), 
    necessidade_especifica: b.necessidade_especifica,
}));
    } catch (error) {
      console.error("Erro ao listar beneficiários:", error);
      return [];
    }
  }
  // Buscar beneficiário por CPF
  async buscarPorCPF(cpf) {
    try {
      const beneficiarios = await this.listarTodos();
      return (
        beneficiarios.find((beneficiario) => beneficiario.cpf === cpf) || null
      );
    } catch (error) {
      console.error("Erro ao buscar por CPF:", error);
      throw error;
    }
  }
  // Excluir beneficiário por CPF
  async excluir(cpf) {
    try {
      const cpfLimpo = cpf.replace(/[.-]/g, "");
      return await ApiService.delete(`beneficiarios/${cpfLimpo}`);
    } catch (error) {
      console.error("Erro ao excluir beneficiário:", error);
      throw error;
    }
  }
  // Filtrar beneficiários por termo (nome, cpf, rg ou uf)
  async filtrar(filtro) {
    try {
      const beneficiarios = await this.listarTodos();
      const filtroLower = filtro.toLowerCase();

      return beneficiarios.filter((beneficiario) =>
        Object.values(beneficiario).some(
          (value) =>
            value && value.toString().toLowerCase().includes(filtroLower)
        )
      );
    } catch (error) {
      console.error("Erro ao filtrar beneficiários:", error);
      throw error;
    }
  }
  // Cadastrar novo beneficiário
  async cadastrar(beneficiario) {
    try {
      const beneficiarioFormatado = {
        ...beneficiario,
        cpf: beneficiario.cpf ? beneficiario.cpf.replace(/\D/g, "") : "",
        rg: beneficiario.rg ? beneficiario.rg.replace(/\D/g, "") : "",
        data_nascimento: beneficiario.data_nascimento
          ? beneficiario.data_nascimento
              .replace(/\D/g, "")
              .replace(/^(\d{2})(\d{2})(\d{4})$/, "$3-$2-$1")
          : "",
        telefone: beneficiario.telefone
          ? beneficiario.telefone.replace(/\D/g, "")
          : "",
        telefone_emergencia: beneficiario.telefone_emergencia
          ? beneficiario.telefone_emergencia.replace(/\D/g, "")
          : "",
        cep: beneficiario.cep ? beneficiario.cep.replace(/\D/g, "") : "",
        uf: beneficiario.uf ? beneficiario.uf.toUpperCase() : "", 
      };
      return await ApiService.post("beneficiarios", beneficiarioFormatado);
    } catch (error) {
      console.error("Erro ao cadastrar beneficiário:", error);
      throw error;
    }
  }
  // Atualizar beneficiário existente
  async atualizar(cpf, beneficiario) {
    try {
      const beneficiarioFormatado = {
        ...beneficiario,
        cpf: beneficiario.cpf ? beneficiario.cpf.replace(/\D/g, "") : "",
        rg: beneficiario.rg ? beneficiario.rg.replace(/\D/g, "") : "",
        data_nascimento: beneficiario.data_nascimento
          ? beneficiario.data_nascimento
              .replace(/\D/g, "")
              .replace(/^(\d{2})(\d{2})(\d{4})$/, "$3-$2-$1")
          : "",
        telefone: beneficiario.telefone
          ? beneficiario.telefone.replace(/\D/g, "")
          : "",
        telefone_emergencia: beneficiario.telefone_emergencia
          ? beneficiario.telefone_emergencia.replace(/\D/g, "")
          : "",
        cep: beneficiario.cep ? beneficiario.cep.replace(/\D/g, "") : "",
        uf: beneficiario.uf ? beneficiario.uf.toUpperCase() : "", // NOVO CAMPO
      };
      
      // Usa o CPF limpo para a URL da requisição
      const cpfLimpo = cpf.replace(/[.-]/g, "");
      return await ApiService.put(
        `beneficiarios/${cpfLimpo}`,
        beneficiarioFormatado
      );
    } catch (error) {
      console.error("Erro ao atualizar beneficiário:", error);
      throw error;
    }
  }
}

export default new BeneficiariosService();