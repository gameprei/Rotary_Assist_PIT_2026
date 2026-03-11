import EmprestimoModel from "../models/EmprestimoModel.js";
import pool from "../config/database.js";
import "./setup.js";

describe("EmprestimoModel", () => {

    test("deve registrar um empréstimo válido", async () => {

        const dados = {
            equipamento_id: 1,
            beneficiario_cpf: "12345678901",
            membro_cpf: "98765432100",
            data_emprestimo: "2026-03-11",
            data_prevista_devolucao: "2026-04-11"
        };

        const resultado = await EmprestimoModel.registrar(dados);

        expect(resultado).toHaveProperty("id");
        expect(resultado.status).toBe("ATIVO");

    });


    test("não deve permitir dois empréstimos ativos para o mesmo equipamento", async () => {

        const dados = {
            equipamento_id: 1,
            beneficiario_cpf: "12345678901",
            membro_cpf: "98765432100",
            data_emprestimo: "2026-03-11",
            data_prevista_devolucao: "2026-04-11"
        };

        await EmprestimoModel.registrar(dados);

        await expect(
            EmprestimoModel.registrar(dados)
        ).rejects.toThrow("Este equipamento já possui um empréstimo ativo");

    });


    test("não deve permitir empréstimo de equipamento inexistente", async () => {

        const dados = {
            equipamento_id: 9999,
            beneficiario_cpf: "12345678901",
            membro_cpf: "98765432100",
            data_emprestimo: "2026-03-11",
            data_prevista_devolucao: "2026-04-11"
        };

        await expect(
            EmprestimoModel.registrar(dados)
        ).rejects.toThrow("Equipamento não encontrado");

    });


    test("deve atualizar o status do equipamento para EMPRESTADO", async () => {

        const dados = {
            equipamento_id: 2,
            beneficiario_cpf: "12345678901",
            membro_cpf: "98765432100",
            data_emprestimo: "2026-03-11",
            data_prevista_devolucao: "2026-04-11"
        };

        await EmprestimoModel.registrar(dados);

        const [equipamento] = await pool.query(
            "SELECT status FROM equipamentos WHERE id = ?",
            [2]
        );

        expect(equipamento[0].status).toBe("EMPRESTADO");

    });

});