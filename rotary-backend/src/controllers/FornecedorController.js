import FornecedorModel from '../models/FornecedorModel.js';

class FornecedorController {
    // Listar todos os fornecedores
    static async listarTodos(req, res) {
        try {
            const { termo } = req.query;
            let fornecedores;

            if (termo) {
                fornecedores = await FornecedorModel.buscarPorTermo(termo);
            } else {
                fornecedores = await FornecedorModel.listarTodos();
            }

            res.json(fornecedores);
        } catch (error) {
            console.error("Erro ao listar fornecedores:", error);
            res.status(500).json({ message: "Erro ao listar fornecedores" });
        }
    }

    // Buscar fornecedores por termo (nome || cnpj || cpf || id)
    static async buscarPorTermo(req, res) {
        try {
            const { termo } = req.params;
            const fornecedores = await FornecedorModel.buscarPorTermo(termo);
            if (fornecedores.length === 0) {
                return res.status(404).json({ message: "Fornecedor não encontrado" });
            }
            res.json(fornecedores);
        } catch (error) {
            console.error("Erro ao buscar fornecedor:", error);
            res.status(500).json({ message: "Erro ao buscar fornecedor" });
        }
    }

    // Cadastrar novo fornecedor
    static async cadastrar(req, res) {
        try {
            const { tipo_pessoa, nome, cpf, cnpj, telefone, email, endereco, bairro, cidade, uf, cep, status } = req.body;
            if (!tipo_pessoa || !nome || !telefone || !email || !endereco || !bairro || !cidade || !uf || !cep || !status) {
                return res.status(400).json({ message: "Todos os campos são obrigatórios" });
            }

            if (tipo_pessoa === "PF" && !cpf) {
                return res.status(400).json({ message: "CPF é obrigatório para pessoa física" });
            }

            if (tipo_pessoa === "PJ" && !cnpj) {
                return res.status(400).json({ message: "CNPJ é obrigatório para pessoa jurídica" });
            }

            
            // Validar UF
            const ufRegex = /^[A-Z]{2}$/;
            if (!ufRegex.test(uf)) {
                return res.status(400).json({ message: "UF inválida" });
            }

            let fornecedorExistente;
            if (cpf) {
                fornecedorExistente = await FornecedorModel.buscarPorTermo(cpf);
            } else if (cnpj) {
                fornecedorExistente = await FornecedorModel.buscarPorTermo(cnpj);
            }

            if (fornecedorExistente && fornecedorExistente.length > 0) {
                return res.status(400).json({ message: "Fornecedor com CPF ou CNPJ já existe" });
            }

            const novoFornecedor = await FornecedorModel.cadastrar({
                tipo_pessoa,
                nome,
                cpf,
                cnpj,
                telefone,
                email,
                endereco,
                bairro,
                cidade,
                uf,
                cep,
                status
            });
            res.status(201).json(novoFornecedor);
        } catch (error) {
            console.error("Erro ao cadastrar fornecedor:", error);

            if (error.code === "ER_DUP_ENTRY") {
                return res.status(400).json({ message: "Fornecedor com CPF ou CNPJ já existe" });
            }

            res.status(500).json({ message: "Erro ao cadastrar fornecedor" });
        }
    }
    
    // Atualizar fornecedor existente
    static async atualizar(req, res) {
        try {
            const { id } = req.params;
            const { tipo_pessoa, nome, cpf, cnpj, telefone, email, endereco, bairro, cidade, uf, cep, status } = req.body;
            
            if (!req.body || Object.keys(req.body).length === 0) {
                 return res.status(400).json({ message: "Nenhum campo para atualizar" });
            }

            // Validar CPF
            if (cpf) {
                const cpfRegex = /^\d{11}$/;
                if (!cpfRegex.test(cpf)) {
                    return res.status(400).json({ message: "CPF inválido" });
                }
            }

            // Validar UF
            if (uf) {
                const ufRegex = /^[A-Z]{2}$/;
                if (!ufRegex.test(uf)) {
                    return res.status(400).json({ message: "UF inválida" });
                }
            }

            const fornecedorAtualizado = await FornecedorModel.atualizar(id, {
                tipo_pessoa,
                nome,
                cpf,
                cnpj,
                telefone,
                email,
                endereco,
                bairro,
                cidade,
                uf,
                cep,
                status
            });
            res.json(fornecedorAtualizado);
        } catch (error) {
            console.error("Erro ao atualizar fornecedor:", error);
            if (error.message === "Fornecedor não encontrado") {
                return res.status(404).json({ message: "Fornecedor não encontrado" });
            }
            res.status(500).json({ message: "Erro ao atualizar fornecedor" });
        }
    }

    // Deletar fornecedor
    static async excluir(req, res) {
        try {
            const { id } = req.params;
            const resultado = await FornecedorModel.excluir(id);
            if(!resultado) {
                return res.status(404).json({ message: "Fornecedor não encontrado" });
            }
            res.json({ message: "Fornecedor deletado com sucesso" });
        } catch (error) {
            console.error("Erro ao deletar fornecedor:", error);
            res.status(500).json({ message: "Erro ao deletar fornecedor" });
        }
    }
}
export default FornecedorController;