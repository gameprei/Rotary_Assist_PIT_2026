import ApiService from "./ApiService.js";

class BeneficiariosService {

  // =========================
  // HELPERS
  // =========================

  limparNumeros(valor) {
    return valor ? valor.replace(/\D/g, "") : "";
  }

  formatarDataParaFront(data) {
    if (!data) return "";
    const dataSemHora = data.split("T")[0];
    return dataSemHora.replace(
      /^(\d{4})-(\d{2})-(\d{2})$/,
      (_, ano, mes, dia) => `${dia}/${mes}/${ano}`
    );
  }

  formatarDataParaBack(data) {
    if (!data) return "";
    return data
      .replace(/\D/g, "")
      .replace(/^(\d{2})(\d{2})(\d{4})$/, "$3-$2-$1");
  }

  aplicarMascaraCPF(cpf) {
    const v = this.limparNumeros(cpf);
    return v.length === 11
      ? v.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
      : cpf || "";
  }

  aplicarMascaraRG(rg) {
    const v = this.limparNumeros(rg);
    return v.length === 9
      ? v.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, "$1.$2.$3-$4")
      : rg || "";
  }

  aplicarMascaraTelefone(tel) {
    const v = this.limparNumeros(tel);

    if (v.length === 11) {
      return v.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    }

    if (v.length === 10) {
      return v.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    }

    return tel || "";
  }

  aplicarMascaraCEP(cep) {
    const v = this.limparNumeros(cep);
    return v.length === 8
      ? v.replace(/(\d{5})(\d{3})/, "$1-$2")
      : cep || "";
  }

  // =========================
  // NORMALIZAÇÃO
  // =========================

  formatarParaFront(b) {
    return {
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
    };
  }

  formatarParaBack(b) {
    return {
      ...b,
      cpf: this.limparNumeros(b.cpf),
      rg: this.limparNumeros(b.rg),
      data_nascimento: this.formatarDataParaBack(b.data_nascimento),
      telefone: this.limparNumeros(b.telefone),
      telefone_emergencia: this.limparNumeros(b.telefone_emergencia),
      cep: this.limparNumeros(b.cep),
      uf: b.uf ? b.uf.toUpperCase() : "",
    };
  }

  // =========================
  // API
  // =========================

  async listarTodos() {
    try {
      const resposta = await ApiService.get("beneficiarios");

      const dados = Array.isArray(resposta)
        ? resposta
        : resposta.data || resposta.beneficiarios || resposta.results || [];

      return dados.map(this.formatarParaFront.bind(this));

    } catch (error) {
      console.error("Erro ao listar beneficiários:", error);
      return [];
    }
  }

  async buscarPorCPF(cpf) {
    try {
      const cpfLimpo = this.limparNumeros(cpf);

      const resposta = await ApiService.get(`beneficiarios/${cpfLimpo}`);

      return this.formatarParaFront(resposta);

    } catch (error) {
      console.error("Erro ao buscar por CPF:", error);
      throw error;
    }
  }

  async excluir(cpf) {
    try {
      const cpfLimpo = this.limparNumeros(cpf);
      return await ApiService.delete(`beneficiarios/${cpfLimpo}`);
    } catch (error) {
      console.error("Erro ao excluir beneficiário:", error);
      throw error;
    }
  }

  async filtrar(filtro) {
    try {
      const beneficiarios = await this.listarTodos();
      const filtroLower = filtro.toLowerCase();

      return beneficiarios.filter((b) =>
        Object.values(b).some(
          (v) => v && v.toString().toLowerCase().includes(filtroLower)
        )
      );

    } catch (error) {
      console.error("Erro ao filtrar beneficiários:", error);
      throw error;
    }
  }

  async cadastrar(beneficiario) {
    try {
      return await ApiService.post(
        "beneficiarios",
        this.formatarParaBack(beneficiario)
      );
    } catch (error) {
      console.error("Erro ao cadastrar beneficiário:", error);
      throw error;
    }
  }

  async atualizar(cpf, beneficiario) {
    try {
      const cpfLimpo = this.limparNumeros(cpf);

      return await ApiService.put(
        `beneficiarios/${cpfLimpo}`,
        this.formatarParaBack(beneficiario)
      );

    } catch (error) {
      console.error("Erro ao atualizar beneficiário:", error);
      throw error;
    }
  }
}

export default new BeneficiariosService();