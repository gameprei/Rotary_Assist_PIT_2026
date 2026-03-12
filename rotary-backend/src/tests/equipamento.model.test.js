import EquipamentoModel from "../models/EquipamentoModel.js";
import pool from "../config/database.js";
import "./setup.js";

describe("EquipamentoModel - Cadastro de equipamentos", () => {

    const dadosBase = {
        nome: "Cadeira de Rodas Teste",
        descricao: "Equipamento para testes",
        patrimonio: "PAT-2001",
        numero_serie: "SER-2001",
        categoria_id: 1,
        fornecedor_id: 1,
        estado_conservacao: "BOM",
        data_aquisicao: "2024-01-01"
    };

    test("deve cadastrar um equipamento válido", async () => {

        const resultado = await EquipamentoModel.cadastrar(dadosBase);

        expect(resultado).toHaveProperty("id");
        expect(resultado.nome).toBe(dadosBase.nome);

    });

    test("não deve permitir patrimônio duplicado", async () => {

        const equipamento = {
            ...dadosBase,
            patrimonio: "PAT-DUP-1",
            numero_serie: "SER-DUP-1"
        };

        await EquipamentoModel.cadastrar(equipamento);

        await expect(
            EquipamentoModel.cadastrar(equipamento)
        ).rejects.toThrow("Já existe um equipamento cadastrado com este patrimônio");

    });

    test("não deve permitir número de série duplicado", async () => {

        const equipamento1 = {
            ...dadosBase,
            patrimonio: "PAT-3001",
            numero_serie: "SER-DUP-2"
        };

        const equipamento2 = {
            ...dadosBase,
            patrimonio: "PAT-3002",
            numero_serie: "SER-DUP-2"
        };

        await EquipamentoModel.cadastrar(equipamento1);

        await expect(
            EquipamentoModel.cadastrar(equipamento2)
        ).rejects.toThrow("Número de série já cadastrado");

    });

    test("não deve cadastrar equipamento com categoria inexistente", async () => {

        const dados = {
            ...dadosBase,
            patrimonio: "PAT-4001",
            numero_serie: "SER-4001",
            categoria_id: 999
        };

        await expect(
            EquipamentoModel.cadastrar(dados)
        ).rejects.toThrow("Categoria não encontrada ou inativa");

    });

    test("não deve cadastrar equipamento com fornecedor inexistente", async () => {

        const dados = {
            ...dadosBase,
            patrimonio: "PAT-5001",
            numero_serie: "SER-5001",
            fornecedor_id: 999
        };

        await expect(
            EquipamentoModel.cadastrar(dados)
        ).rejects.toThrow("Fornecedor não encontrado ou inativo");

    });

});