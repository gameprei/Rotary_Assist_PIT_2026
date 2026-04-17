import EquipamentoModel from "../../models/EquipamentoModel.js";
import "../setup.js";

describe("EquipamentoModel", () => {

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

    test("deve listar equipamentos", async () => {

        const resultado = await EquipamentoModel.listarTodos();

        expect(Array.isArray(resultado)).toBe(true);
        expect(resultado.length).toBeGreaterThan(0);

    });

    test("deve buscar por termo", async () => {

        const resultado = await EquipamentoModel.buscarPorTermo("PAT001");

        expect(Array.isArray(resultado)).toBe(true);
        expect(resultado.length).toBeGreaterThan(0);

    });

    test("deve buscar por id", async () => {

        const resultado = await EquipamentoModel.buscarPorId(1);

        expect(resultado).not.toBeNull();
        expect(resultado.id).toBe(1);

    });

    test("deve cadastrar equipamento", async () => {

        const resultado = await EquipamentoModel.cadastrar(dadosBase);

        expect(resultado).toHaveProperty("id");
        expect(resultado.nome).toBe(dadosBase.nome);

    });

    test("deve validar patrimonio duplicado", async () => {

        await EquipamentoModel.cadastrar({
            ...dadosBase,
            patrimonio: "PAT-DUP-1",
            numero_serie: "SER-DUP-1",
        });

        const duplicado = await EquipamentoModel.existePatrimonioDuplicado("PAT-DUP-1");

        expect(duplicado).toBe(true);

    });

    test("deve validar numero de serie duplicado", async () => {

        await EquipamentoModel.cadastrar({
            ...dadosBase,
            patrimonio: "PAT-3001",
            numero_serie: "SER-DUP-2"
        });

        const duplicado = await EquipamentoModel.existeNumeroSerieDuplicado("SER-DUP-2");

        expect(duplicado).toBe(true);

    });

    test("deve atualizar equipamento", async () => {

        const cadastrado = await EquipamentoModel.cadastrar({
            ...dadosBase,
            patrimonio: "PAT-UPD-1",
            numero_serie: "SER-UPD-1",
        });

        const atualizado = await EquipamentoModel.atualizar(cadastrado.id, {
            nome: "Equipamento Atualizado",
        });

        expect(atualizado).not.toBeNull();
        expect(atualizado.nome).toBe("Equipamento Atualizado");

    });

    test("deve retornar null ao atualizar status de equipamento inexistente", async () => {

        const resultado = await EquipamentoModel.atualizarStatus(9999, "DISPONIVEL");

        expect(resultado).toBeNull();

    });

    test("deve excluir equipamento existente", async () => {

        const cadastrado = await EquipamentoModel.cadastrar({
            ...dadosBase,
            patrimonio: "PAT-DEL-1",
            numero_serie: "SER-DEL-1",
        });

        const excluiu = await EquipamentoModel.excluir(cadastrado.id);

        expect(excluiu).toBe(true);

    });

    test("deve validar categoria ativa", async () => {

        const categoriaAtiva = await EquipamentoModel.categoriaAtivaExiste(1);

        expect(categoriaAtiva).toBe(true);

    });

    test("deve validar fornecedor ativo", async () => {

        const fornecedorAtivo = await EquipamentoModel.fornecedorAtivoExiste(1);

        expect(fornecedorAtivo).toBe(true);

    });

    test("deve identificar equipamento emprestado", async () => {

        const emprestado = await EquipamentoModel.equipamentoEmprestado(1);

        expect(emprestado).toBe(false);

    });

    test("deve retornar false ao excluir equipamento inexistente", async () => {

        const excluiu = await EquipamentoModel.excluir(9999);

        expect(excluiu).toBe(false);

    });
});