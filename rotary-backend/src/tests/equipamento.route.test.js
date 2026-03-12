import request from "supertest";
import app from "../app.js";
import pool from "../config/database.js";
import "./setup.js";

describe("POST /api/equipamentos", () => {

    test("deve cadastrar um equipamento válido", async () => {

        const response = await request(app)
            .post("/api/equipamentos")
            .send({
                nome: "Cadeira de Rodas Premium",
                descricao: "Cadeira para testes",
                patrimonio: "PAT-1001",
                numero_serie: "SER-ABC-001",
                categoria_id: 1,
                fornecedor_id: 1,
                estado_conservacao: "BOM",
                data_aquisicao: "2024-01-10"
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");

    });

    test("não deve cadastrar equipamento sem campos obrigatórios", async () => {

        const response = await request(app)
            .post("/api/equipamentos")
            .send({
                nome: "Equipamento incompleto"
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");

    });

    test("não deve permitir patrimônio duplicado", async () => {

        const equipamento = {
            nome: "Andador",
            descricao: "Equipamento de mobilidade",
            patrimonio: "PAT-DUP",
            numero_serie: "SER-123",
            categoria_id: 1,
            fornecedor_id: 1,
            estado_conservacao: "BOM",
            data_aquisicao: "2024-02-01"
        };

        await request(app)
            .post("/api/equipamentos")
            .send(equipamento);

        const response = await request(app)
            .post("/api/equipamentos")
            .send(equipamento);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");

    });

    test("não deve cadastrar equipamento com categoria inexistente", async () => {

        const response = await request(app)
            .post("/api/equipamentos")
            .send({
                nome: "Equipamento Teste",
                descricao: "Teste",
                patrimonio: "PAT-999",
                numero_serie: "SER-999",
                categoria_id: 999,
                fornecedor_id: 1,
                estado_conservacao: "BOM",
                data_aquisicao: "2024-01-01"
            });

        expect(response.status).toBe(400);

    });

    describe("PUT /api/equipamentos/:id", () => {

        test("deve atualizar um equipamento existente", async () => {

            const novo = await request(app)
                .post("/api/equipamentos")
                .send({
                    nome: "Muleta",
                    descricao: "Equipamento inicial",
                    patrimonio: "PAT-UPD",
                    numero_serie: "SER-UPD",
                    categoria_id: 1,
                    fornecedor_id: 1,
                    estado_conservacao: "BOM",
                    data_aquisicao: "2024-01-01"
                });

            const id = novo.body.id;

            const response = await request(app)
                .put(`/api/equipamentos/${id}`)
                .send({
                    nome: "Muleta Atualizada",
                    descricao: "Atualizado",
                    patrimonio: "PAT-UPD",
                    numero_serie: "SER-UPD",
                    categoria_id: 1,
                    fornecedor_id: 1,
                    estado_conservacao: "NOVO",
                    data_aquisicao: "2024-01-01"
                });

            expect(response.status).toBe(200);
            expect(response.body.nome).toBe("Muleta Atualizada");

        });

        test("não deve atualizar equipamento inexistente", async () => {

            const response = await request(app)
                .put("/api/equipamentos/9999")
                .send({
                    nome: "Teste"
                });

            expect(response.status).toBe(400);

        });

    });

});