import ApiService from "./ApiService.js";

class MembrosService {
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

  // Listar todos os membros
  async listarTodos() {
    try {
      const resposta = await ApiService.get("membros");
      
      // Normaliza para array
      let dados = [];
      if (Array.isArray(resposta)) {
        dados = resposta;
      } else if (resposta && typeof resposta === 'object') {
        // Se for um objeto, tenta extrair um array
        if (resposta.data && Array.isArray(resposta.data)) {
          dados = resposta.data;
        } else if (resposta.membros && Array.isArray(resposta.membros)) {
          dados = resposta.membros;
        } else if (resposta.results && Array.isArray(resposta.results)) {
          dados = resposta.results;
        } else {
          dados = [resposta];
        }
      }

      // Converte cada linha da API para o formato que o front usa
      const membrosFormatados = dados.map((m) => {
        const membro = {
          nome: m.NOME || m.nome || "",
          cpf: this.aplicarMascaraCPF(m.CPF || m.cpf || ""),
          rg: this.aplicarMascaraRG(m.RG || m.rg || ""),
          email: m.EMAIL || m.email || "",
          telefone: this.aplicarMascaraTelefone(m.TELEFONE || m.telefone || ""),
          data_nascimento: this.formatarDataParaFront(m.DATA_NASCIMENTO || m.data_nascimento || ""),
          data_ingresso: this.formatarDataParaFront(m.DATA_INGRESSO || m.data_ingresso || ""),
          endereco: m.ENDERECO || m.endereco || "",
          bairro: m.BAIRRO || m.bairro || "",
          cidade: m.CIDADE || m.cidade || "",
          uf: m.UF || m.uf || "", 
          cep: this.aplicarMascaraCEP(m.CEP || m.cep || ""),
          cargo: m.CARGO || m.cargo || "",
          profissao: m.PROFISSAO || m.profissao || "",
          empresa: m.EMPRESA || m.empresa || "",
        };
        
        return membro;
      });

      return membrosFormatados;
    } catch (error) {
      console.error("Erro ao listar membros:", error);
      return [];
    }
  }

  // Buscar membro por CPF
  async buscarPorCPF(cpf) {
    try {
      const membros = await this.listarTodos();
      const cpfSemMascara = cpf.replace(/\D/g, "");
      return membros.find((membro) => {
        const membroCpfSemMascara = membro.cpf.replace(/\D/g, "");
        return membroCpfSemMascara === cpfSemMascara;
      }) || null;
    } catch (error) {
      console.error("Erro ao buscar por CPF:", error);
      throw error;
    }
  }

  // Excluir membro por CPF
  async excluir(cpf) {
    try {
      const cpfLimpo = cpf.replace(/[.-]/g, "");
      return await ApiService.delete(`membros/${cpfLimpo}`);
    } catch (error) {
      console.error("Erro ao excluir membro:", error);
      throw error;
    }
  }

  // Filtrar membros por termo (nome, cpf, email, cargo ou uf)
  async filtrar(filtro) {
    try {
      const membros = await this.listarTodos();
      const filtroLower = filtro.toLowerCase();

      return membros.filter((membro) =>
        Object.values(membro).some(
          (value) =>
            value && value.toString().toLowerCase().includes(filtroLower)
        )
      );
    } catch (error) {
      console.error("Erro ao filtrar membros:", error);
      throw error;
    }
  }

  // Cadastrar novo membro
  async cadastrar(membro) {
    try {
    const cpfLimpo = membro.cpf ? membro.cpf.replace(/\D/g, "") : "";
    const membroExistente = await this.buscarPorCPF(cpfLimpo);
    
    if (membroExistente) {
      throw new Error("CPF já cadastrado no sistema");
    }
      const membroFormatado = {
        nome: membro.nome || "",
        cpf: membro.cpf ? membro.cpf.replace(/\D/g, "") : "",
        rg: membro.rg ? membro.rg.replace(/\D/g, "") : "",
        email: membro.email || "",
        telefone: membro.telefone ? membro.telefone.replace(/\D/g, "") : "",
        data_nascimento: membro.data_nascimento
          ? membro.data_nascimento
              .replace(/\D/g, "")
              .replace(/^(\d{2})(\d{2})(\d{4})$/, "$3-$2-$1")
          : "",
        data_ingresso: membro.data_ingresso
          ? membro.data_ingresso
              .replace(/\D/g, "")
              .replace(/^(\d{2})(\d{2})(\d{4})$/, "$3-$2-$1")
          : "",
        endereco: membro.endereco || "",
        bairro: membro.bairro || "",
        cidade: membro.cidade || "",
        uf: membro.uf ? membro.uf.toUpperCase() : "",
        cep: membro.cep ? membro.cep.replace(/\D/g, "") : "",
        cargo: membro.cargo || "",
        profissao: membro.profissao || "",
        empresa: membro.empresa || "",
      };

      return await ApiService.post("membros", membroFormatado);
    } catch (error) {
      console.error("Erro ao cadastrar membro:", error);
      throw error;
    }
  }

  // Atualizar membro existente
  async atualizar(cpf, membro) {
    try {
      const membroFormatado = {
        nome: membro.nome || "",
        cpf: membro.cpf ? membro.cpf.replace(/\D/g, "") : "",
        rg: membro.rg ? membro.rg.replace(/\D/g, "") : "",
        email: membro.email || "",
        telefone: membro.telefone ? membro.telefone.replace(/\D/g, "") : "",
        data_nascimento: membro.data_nascimento
          ? membro.data_nascimento
              .replace(/\D/g, "")
              .replace(/^(\d{2})(\d{2})(\d{4})$/, "$3-$2-$1")
          : "",
        data_ingresso: membro.data_ingresso
          ? membro.data_ingresso
              .replace(/\D/g, "")
              .replace(/^(\d{2})(\d{2})(\d{4})$/, "$3-$2-$1")
          : "",
        endereco: membro.endereco || "",
        bairro: membro.bairro || "",
        cidade: membro.cidade || "",
        uf: membro.uf ? membro.uf.toUpperCase() : "", 
        cep: membro.cep ? membro.cep.replace(/\D/g, "") : "",
        cargo: membro.cargo || "",
        profissao: membro.profissao || "",
        empresa: membro.empresa || "",
      };

      const cpfLimpo = cpf.replace(/[.-]/g, "");
      return await ApiService.put(`membros/${cpfLimpo}`, membroFormatado);
    } catch (error) {
      console.error("Erro ao atualizar membro:", error);
      throw error;
    }
  }
}

export default new MembrosService();
