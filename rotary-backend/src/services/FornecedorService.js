import AppError from "../utils/AppError.js";
import FornecedorModel from "../models/FornecedorModel.js";
import ValidationService from "./ValidationService.js";

class FornecedorService {
  static async listarTodos(termo) {
    if (termo) {
      return await FornecedorModel.buscarPorTermo(termo);
    }

    return await FornecedorModel.listarTodos();
  }

  static async buscarPorTermo(termo) {
    if (!termo) {
      throw new AppError("Termo de busca não informado", 400);
    }

    const fornecedores = await FornecedorModel.buscarPorTermo(termo);
    if (fornecedores.length === 0) {
      throw new AppError("Fornecedor não encontrado", 404);
    }

    return fornecedores;
  }

  static async cadastrar(data) {
    ValidationService.validarBody(data);
    ValidationService.validarCamposObrigatorios(
      data,
      ["tipo_pessoa", "nome", "telefone", "email", "endereco", "bairro", "cidade", "uf", "cep"],
      "Todos os campos são obrigatórios"
    );

    const tipoPessoa = String(data.tipo_pessoa).toUpperCase();
    const status = data.status ? String(data.status).toUpperCase() : "ATIVO";

    ValidationService.validarEnum(tipoPessoa, ["PF", "PJ"], "Tipo de pessoa inválido");
    ValidationService.validarEnum(status, ["ATIVO", "INATIVO"], "Status inválido");
    ValidationService.validarUF(data.uf);
    ValidationService.validarEmail(data.email);
    ValidationService.validarTelefone(data.telefone);

    if (tipoPessoa === "PF") {
      if (!data.cpf) {
        throw new AppError("CPF é obrigatório para pessoa física", 400);
      }
      ValidationService.validarCPF(data.cpf);

      const cpfDuplicado = await FornecedorModel.existeCpfDuplicado(data.cpf);
      if (cpfDuplicado) {
        throw new AppError("Já existe fornecedor com este CPF", 409);
      }
    }

    if (tipoPessoa === "PJ") {
      if (!data.cnpj) {
        throw new AppError("CNPJ é obrigatório para pessoa jurídica", 400);
      }
      ValidationService.validarCNPJ(data.cnpj);

      const cnpjDuplicado = await FornecedorModel.existeCnpjDuplicado(data.cnpj);
      if (cnpjDuplicado) {
        throw new AppError("Já existe fornecedor com este CNPJ", 409);
      }
    }

    return await FornecedorModel.cadastrar({
      tipo_pessoa: tipoPessoa,
      nome: data.nome,
      cpf: data.cpf || null,
      cnpj: data.cnpj || null,
      telefone: data.telefone,
      email: data.email,
      endereco: data.endereco,
      bairro: data.bairro,
      cidade: data.cidade,
      uf: data.uf,
      cep: data.cep,
      status,
    });
  }

  static async atualizar(id, data) {
    ValidationService.validarIdPositivo(id);
    ValidationService.validarBody(data, "Nenhum campo para atualizar");

    const fornecedorExistente = await FornecedorModel.buscarPorId(id);
    if (!fornecedorExistente) {
      throw new AppError("Fornecedor não encontrado", 404);
    }

    const camposPermitidos = [
      "tipo_pessoa",
      "nome",
      "cpf",
      "cnpj",
      "telefone",
      "email",
      "endereco",
      "bairro",
      "cidade",
      "uf",
      "cep",
      "status",
    ];

    const dadosAtualizacao = {};
    for (const campo of camposPermitidos) {
      if (Object.prototype.hasOwnProperty.call(data, campo)) {
        dadosAtualizacao[campo] = data[campo];
      }
    }

    if (Object.keys(dadosAtualizacao).length === 0) {
      throw new AppError("Nenhum campo válido informado para atualização", 400);
    }

    if (dadosAtualizacao.tipo_pessoa) {
      dadosAtualizacao.tipo_pessoa = String(dadosAtualizacao.tipo_pessoa).toUpperCase();
      ValidationService.validarEnum(
        dadosAtualizacao.tipo_pessoa,
        ["PF", "PJ"],
        "Tipo de pessoa inválido"
      );
    }

    if (dadosAtualizacao.status) {
      dadosAtualizacao.status = String(dadosAtualizacao.status).toUpperCase();
      ValidationService.validarEnum(dadosAtualizacao.status, ["ATIVO", "INATIVO"], "Status inválido");
    }

    if (dadosAtualizacao.uf) {
      ValidationService.validarUF(dadosAtualizacao.uf);
    }

    if (dadosAtualizacao.email) {
      ValidationService.validarEmail(dadosAtualizacao.email);
    }

    if (dadosAtualizacao.telefone) {
      ValidationService.validarTelefone(dadosAtualizacao.telefone);
    }

    if (dadosAtualizacao.cpf) {
      ValidationService.validarCPF(dadosAtualizacao.cpf);
      const cpfDuplicado = await FornecedorModel.existeCpfDuplicado(dadosAtualizacao.cpf, id);
      if (cpfDuplicado) {
        throw new AppError("Já existe fornecedor com este CPF", 409);
      }
    }

    if (dadosAtualizacao.cnpj) {
      ValidationService.validarCNPJ(dadosAtualizacao.cnpj);
      const cnpjDuplicado = await FornecedorModel.existeCnpjDuplicado(dadosAtualizacao.cnpj, id);
      if (cnpjDuplicado) {
        throw new AppError("Já existe fornecedor com este CNPJ", 409);
      }
    }

    const tipoPessoaFinal = dadosAtualizacao.tipo_pessoa || fornecedorExistente.tipo_pessoa;
    const cpfFinal = Object.prototype.hasOwnProperty.call(dadosAtualizacao, "cpf")
      ? dadosAtualizacao.cpf
      : fornecedorExistente.cpf;
    const cnpjFinal = Object.prototype.hasOwnProperty.call(dadosAtualizacao, "cnpj")
      ? dadosAtualizacao.cnpj
      : fornecedorExistente.cnpj;

    if (tipoPessoaFinal === "PF" && !cpfFinal) {
      throw new AppError("CPF é obrigatório para pessoa física", 400);
    }

    if (tipoPessoaFinal === "PJ" && !cnpjFinal) {
      throw new AppError("CNPJ é obrigatório para pessoa jurídica", 400);
    }

    return await FornecedorModel.atualizar(id, dadosAtualizacao);
  }

  static async excluir(id) {
    ValidationService.validarIdPositivo(id);

    const fornecedorExistente = await FornecedorModel.buscarPorId(id);
    if (!fornecedorExistente) {
      throw new AppError("Fornecedor não encontrado", 404);
    }

    const fornecedorEmUso = await FornecedorModel.fornecedorEmUso(id);
    if (fornecedorEmUso) {
      throw new AppError("Fornecedor não pode ser excluído pois está em uso", 409);
    }

    await FornecedorModel.excluir(id);
    return { message: "Fornecedor excluído com sucesso" };
  }
}

export default FornecedorService;
