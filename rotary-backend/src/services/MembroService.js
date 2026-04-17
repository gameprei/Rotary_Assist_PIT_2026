import AppError from "../utils/AppError.js";
import MembroModel from "../models/MembroModel.js";
import ValidationService from "./ValidationService.js";

class MembroService {
  static async listarTodos(termo) {
    if (termo) {
      return await MembroModel.filtrarPorTermo(termo);
    }

    return await MembroModel.listarTodos();
  }

  static async buscarPorTermo(termo) {
    if (!termo) {
      throw new AppError("Termo de busca não informado", 400);
    }

    const membros = await MembroModel.filtrarPorTermo(termo);
    if (membros.length === 0) {
      throw new AppError("Membro não encontrado", 404);
    }

    return membros;
  }

  static async cadastrar(data) {
    ValidationService.validarBody(data);

    ValidationService.validarCamposObrigatorios(data, [
      "nome",
      "cpf",
      "rg",
      "email",
      "telefone",
      "data_nascimento",
      "data_ingresso",
      "endereco",
      "bairro",
      "cidade",
      "uf",
      "cep",
      "cargo",
      "profissao",
      "empresa",
    ]);

    ValidationService.validarCPF(data.cpf);
    ValidationService.validarRg(data.rg);
    ValidationService.validarEmail(data.email);
    ValidationService.validarTelefone(data.telefone);
    ValidationService.validarDataNascimento(data.data_nascimento);
    ValidationService.validarUF(data.uf);

    if (Number.isNaN(new Date(data.data_ingresso).getTime())) {
      throw new AppError("Data de ingresso inválida", 400);
    }

    const cpfDuplicado = await MembroModel.validarCpfDuplicado(data.cpf);
    if (cpfDuplicado) {
      throw new AppError("CPF já cadastrado para outro membro", 409);
    }

    return await MembroModel.cadastrar(data);
  }

  static async atualizar(cpfAntigo, data) {
    ValidationService.validarBody(data, "Corpo da requisição vazio");
    ValidationService.validarCPF(cpfAntigo, "CPF da URL inválido");

    ValidationService.validarCPF(data.cpf, "Novo CPF inválido");
    ValidationService.validarRg(data.rg);
    ValidationService.validarEmail(data.email);
    ValidationService.validarTelefone(data.telefone);
    ValidationService.validarDataNascimento(data.data_nascimento);
    ValidationService.validarUF(data.uf);

    if (data.data_ingresso && Number.isNaN(new Date(data.data_ingresso).getTime())) {
      throw new AppError("Data de ingresso inválida", 400);
    }

    if (data.cpf) {
      const cpfDuplicado = await MembroModel.validarCpfDuplicado(data.cpf, cpfAntigo);
      if (cpfDuplicado) {
        throw new AppError("Novo CPF já cadastrado para outro membro", 409);
      }
    }

    const camposPermitidos = [
      "nome",
      "cpf",
      "rg",
      "email",
      "telefone",
      "data_nascimento",
      "data_ingresso",
      "endereco",
      "bairro",
      "cidade",
      "uf",
      "cep",
      "cargo",
      "profissao",
      "empresa",
    ];

    const dadosAtualizacao = {};
    for (const campo of camposPermitidos) {
      if (Object.prototype.hasOwnProperty.call(data, campo)) {
        dadosAtualizacao[campo] = data[campo];
      }
    }

    const membroAtualizado = await MembroModel.atualizar(cpfAntigo, dadosAtualizacao);
    if (!membroAtualizado) {
      throw new AppError("Membro não encontrado", 404);
    }

    return membroAtualizado;
  }

  static async excluir(cpf) {
    ValidationService.validarCPF(cpf, "CPF inválido");

    const excluido = await MembroModel.excluir(cpf);
    if (!excluido) {
      throw new AppError("Membro não encontrado", 404);
    }

    return { message: "Membro excluído com sucesso" };
  }
}

export default MembroService;
