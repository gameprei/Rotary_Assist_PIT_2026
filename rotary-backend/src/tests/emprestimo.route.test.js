import request from "supertest";
import app from "../app.js";
import "./setup.js";

describe("POST /emprestimos", () => {

    test("deve registrar empréstimo via API", async () => {

        const response = await request(app)
            .post("/emprestimos")
            .send({
                equipamento_id: 1,
                beneficiario_cpf: "12345678901",
                membro_cpf: "98765432100",
                data_emprestimo: "2026-03-11",
                data_prevista_devolucao: "2026-04-11"
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");

    });

});