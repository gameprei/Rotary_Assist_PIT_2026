import EmprestimoModel from "../models/EmprestimoModel.js";
import "./setup.js";

describe("Concorrência de empréstimos", () => {

    test("não deve permitir dois empréstimos simultâneos para o mesmo equipamento", async () => {

        const dados = {
            equipamento_id: 3,
            beneficiario_cpf: "12345678901",
            membro_cpf: "98765432100",
            data_emprestimo: "2026-03-11",
            data_prevista_devolucao: "2026-04-11"
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