import AppError from "../utils/AppError.js";

class ValidationService {
  static validarBody(data, message = "Dados não informados") {
    if (!data || Object.keys(data).length === 0) {
      throw new AppError(message, 400);
    }
  }

  static validarCamposObrigatorios(data, campos, message = "Todos os campos são obrigatórios") {
    const faltantes = campos.some((campo) => !data[campo]);
    if (faltantes) {
      throw new AppError(message, 400);
    }
  }

  static validarCPF(cpf, message = "CPF inválido") {
    const cpfRegex = /^\d{11}$/;
    if (cpf && !cpfRegex.test(cpf)) {
      throw new AppError(message, 400);
    }
  }

  static validarRg(rg, message = "RG inválido") {
    const rgRegex = /^\d{7,}$/;
    if (rg && !rgRegex.test(rg)) {
      throw new AppError(message, 400);
    }
  }

  static validarUF(uf, message = "UF inválida") {
    const ufRegex = /^[A-Z]{2}$/;
    if (uf && !ufRegex.test(uf)) {
      throw new AppError(message, 400);
    }
  }

  static validarDataNascimento(data_nascimento, message = "Data de nascimento inválida") {
    if (!data_nascimento) {
      return;
    }

    const data = new Date(data_nascimento);
    const anoAtual = new Date().getFullYear();

    if (Number.isNaN(data.getTime()) || data.getFullYear() > anoAtual) {
      throw new AppError(message, 400);
    }
  }

  static validarEmail(email, message = "Email inválido") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      throw new AppError(message, 400);
    }
  }

  static validarTelefone(telefone, message = "Telefone inválido") {
    const telefoneRegex = /^\d{10,}$/;
    if (telefone && !telefoneRegex.test(telefone)) {
      throw new AppError(message, 400);
    }
  }

  static validarCNPJ(cnpj, message = "CNPJ inválido") {
    const cnpjRegex = /^(\d{14}|\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2})$/;
    if (cnpj && !cnpjRegex.test(cnpj)) {
      throw new AppError(message, 400);
    }
  }

  static validarIdPositivo(id, nomeCampo = "ID") {
    const numero = Number(id);
    if (!Number.isInteger(numero) || numero <= 0) {
      throw new AppError(`${nomeCampo} inválido`, 400);
    }
  }

  static validarEnum(valor, valoresPermitidos, message = "Valor inválido") {
    if (!valoresPermitidos.includes(valor)) {
      throw new AppError(message, 400);
    }
  }
}

export default ValidationService;