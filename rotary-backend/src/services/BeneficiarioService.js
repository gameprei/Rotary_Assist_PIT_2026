import AppError from "../utils/AppError.js";
import BeneficiarioModel from "../models/BeneficiarioModel.js";
import ValidationService from "./ValidationService.js";

class BeneficiarioService {
    static async listarTodos(termo) {
        if (termo) {
            return await BeneficiarioModel.buscarPorTermo(termo);
        }

        return await BeneficiarioModel.listarTodos();
    }

    static async buscarPorTermo(termo) {
        if (!termo) {
            throw new AppError("Termo de busca não informado", 400);
        }

        const beneficiarios = await BeneficiarioModel.buscarPorTermo(termo);
        if (beneficiarios.length === 0) {
            throw new AppError("Beneficiário não encontrado", 404);
        }

        return beneficiarios;
    }

    static async cadastrar(data) {
        ValidationService.validarBody(data);

        ValidationService.validarCamposObrigatorios(data, [
            "nome",
            "cpf",
            "rg",
            "data_nascimento",
            "telefone",
            "email",
            "endereco",
            "bairro",
            "cidade",
            "uf",
            "cep",
            "contato_emergencia",
            "telefone_emergencia",
        ]);

        ValidationService.validarCPF(data.cpf);
        ValidationService.validarRg(data.rg);
        ValidationService.validarDataNascimento(data.data_nascimento);
        ValidationService.validarTelefone(data.telefone);
        ValidationService.validarEmail(data.email);
        ValidationService.validarUF(data.uf);

        const cpfDuplicado = await BeneficiarioModel.validarCpfDuplicado(data.cpf);
        if (cpfDuplicado) {
            throw new AppError("CPF já cadastrado para outro beneficiário", 409);
        }

        return await BeneficiarioModel.cadastrar(data);
    }

    static async atualizar(cpfAntigo, data) {
        ValidationService.validarBody(data, "Corpo da requisição vazio");
        ValidationService.validarCPF(cpfAntigo, "CPF da URL inválido");

        ValidationService.validarCPF(data.cpf, "Novo CPF inválido");
        ValidationService.validarRg(data.rg);
        ValidationService.validarUF(data.uf);
        ValidationService.validarDataNascimento(data.data_nascimento);
        ValidationService.validarEmail(data.email);
        ValidationService.validarTelefone(data.telefone);

        if (data.cpf) {
            const cpfDuplicado = await BeneficiarioModel.validarCpfDuplicado(
                data.cpf,
                cpfAntigo
            );
            if (cpfDuplicado) {
                throw new AppError("Novo CPF já cadastrado para outro beneficiário", 409);
            }
        }

        const camposPermitidos = [
            "nome",
            "cpf",
            "rg",
            "data_nascimento",
            "telefone",
            "email",
            "endereco",
            "bairro",
            "cidade",
            "uf",
            "cep",
            "contato_emergencia",
            "telefone_emergencia",
            "necessidade_especifica",
        ];

        const dadosAtualizacao = {};
        for (const campo of camposPermitidos) {
            if (Object.prototype.hasOwnProperty.call(data, campo)) {
                dadosAtualizacao[campo] = data[campo];
            }
        }

        const beneficiarioAtualizado = await BeneficiarioModel.atualizar(
            cpfAntigo,
            dadosAtualizacao
        );

        if (!beneficiarioAtualizado) {
            throw new AppError("Beneficiário não encontrado", 404);
        }

        return beneficiarioAtualizado;
    }

    static async excluir(cpf) {
        ValidationService.validarCPF(cpf, "CPF inválido");

        const excluido = await BeneficiarioModel.excluir(cpf);
        if (!excluido) {
            throw new AppError("Beneficiário não encontrado", 404);
        }

        return { message: "Beneficiário excluído com sucesso" };
    }
}

export default BeneficiarioService;