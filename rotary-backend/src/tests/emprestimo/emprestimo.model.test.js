import EmprestimoModel from "../../models/EmprestimoModel.js";
import pool from "../../config/database.js";
import "../setup.js";

describe("EmprestimoModel - Registro de empréstimos", () => {

    const dadosBase = {
        equipamento_id: 1,
        beneficiario_cpf: "12345678901",
        membro_cpf: "98765432100",
        data_emprestimo: "2026-03-10",
        data_prevista_devolucao: "2026-04-10"
    };

    test("deve registrar um empréstimo válido", async () => {

        const resultado = await EmprestimoModel.registrar(dadosBase);

        expect(resultado).toHaveProperty("id");
        expect(resultado.status).toBe("ATIVO");

    });

    test("deve atualizar status do equipamento para EMPRESTADO", async () => {

        await EmprestimoModel.registrar(dadosBase);

        const [equipamento] = await pool.query(
            "SELECT status FROM equipamentos WHERE id = ?",
            [dadosBase.equipamento_id]
        );

        expect(equipamento[0].status).toBe("EMPRESTADO");

    });

});


describe("EmprestimoModel - Validação de datas", () => {

    test("não deve aceitar data de devolução menor que a data de empréstimo", async () => {

        const dados = {
            equipamento_id: 1,
            beneficiario_cpf: "12345678901",
            membro_cpf: "98765432100",
            data_emprestimo: "2026-04-10",
            data_prevista_devolucao: "2026-03-10"
        };

        await expect(
            EmprestimoModel.registrar(dados)
        ).rejects.toThrow();

    });

    test("não deve aceitar datas iguais", async () => {

        const dados = {
            equipamento_id: 1,
            beneficiario_cpf: "12345678901",
            membro_cpf: "98765432100",
            data_emprestimo: "2026-03-10",
            data_prevista_devolucao: "2026-03-10"
        };

        await expect(
            EmprestimoModel.registrar(dados)
        ).rejects.toThrow();

    });

    test("não deve aceitar formato de data inválido", async () => {

        const dados = {
            equipamento_id: 1,
            beneficiario_cpf: "12345678901",
            membro_cpf: "98765432100",
            data_emprestimo: "10/03/2026",
            data_prevista_devolucao: "10/04/2026"
        };

        await expect(
            EmprestimoModel.registrar(dados)
        ).rejects.toThrow();

    });

    test("não deve aceitar data inexistente", async () => {

        const dados = {
            equipamento_id: 1,
            beneficiario_cpf: "12345678901",
            membro_cpf: "98765432100",
            data_emprestimo: "2026-02-30",
            data_prevista_devolucao: "2026-03-10"
        };

        await expect(
            EmprestimoModel.registrar(dados)
        ).rejects.toThrow();

    });

});


describe("EmprestimoModel - Regras de negócio", () => {

    test("não deve permitir empréstimo de equipamento inexistente", async () => {

        const dados = {
            equipamento_id: 999,
            beneficiario_cpf: "12345678901",
            membro_cpf: "98765432100",
            data_emprestimo: "2026-03-10",
            data_prevista_devolucao: "2026-04-10"
        };

        await expect(
            EmprestimoModel.registrar(dados)
        ).rejects.toThrow("Equipamento não encontrado");

    });

    test("não deve permitir dois empréstimos ativos para o mesmo equipamento", async () => {

        const dados = {
            equipamento_id: 1,
            beneficiario_cpf: "12345678901",
            membro_cpf: "98765432100",
            data_emprestimo: "2026-03-10",
            data_prevista_devolucao: "2026-04-10"
        };

        await EmprestimoModel.registrar(dados);

        await expect(
            EmprestimoModel.registrar(dados)
        ).rejects.toThrow("Este equipamento já possui um empréstimo ativo");

    });

    test("não deve permitir empréstimo sem membro responsável", async () => {

        const dados = {
            equipamento_id: 1,
            beneficiario_cpf: "12345678901",
            membro_cpf: null,
            data_emprestimo: "2026-03-10",
            data_prevista_devolucao: "2026-04-10"
        };

        await expect(
            EmprestimoModel.registrar(dados)
        ).rejects.toThrow();

    });

});


describe("EmprestimoModel - Concorrência", () => {

    test("não deve permitir dois empréstimos simultâneos para o mesmo equipamento", async () => {

        const dados = {
            equipamento_id: 1,
            beneficiario_cpf: "12345678901",
            membro_cpf: "98765432100",
            data_emprestimo: "2026-03-10",
            data_prevista_devolucao: "2026-04-10"
        };

        const resultados = await Promise.allSettled([
            EmprestimoModel.registrar(dados),
            EmprestimoModel.registrar(dados)
        ]);

        const sucesso = resultados.filter(r => r.status === "fulfilled");
        const erro = resultados.filter(r => r.status === "rejected");

        expect(sucesso.length).toBe(1);
        expect(erro.length).toBe(1);

    });

});