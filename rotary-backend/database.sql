create database if not exists rotarydb

CREATE TABLE IF NOT EXISTS beneficiarios (
    nome VARCHAR(80) NOT NULL,
    cpf VARCHAR(11) NOT NULL PRIMARY KEY,
    rg VARCHAR(9) NOT NULL,
    data_nascimento DATE NOT NULL,
    telefone VARCHAR(11) NOT NULL,
    email VARCHAR(255),
    endereco VARCHAR(255) NOT NULL,
    bairro VARCHAR(80) NOT NULL,
    cidade VARCHAR(80) NOT NULL,
    uf CHAR(2) NOT NULL,
    cep VARCHAR(8) NOT NULL,
    contato_emergencia VARCHAR(80),
    telefone_emergencia VARCHAR(11),
    necessidade_especifica VARCHAR(255)
);

INSERT INTO BENEFICIARIOS (
    NOME, CPF, RG, DATA_NASCIMENTO, TELEFONE, EMAIL, ENDERECO, BAIRRO, CIDADE, UF, CEP, 
    CONTATO_EMERGENCIA, TELEFONE_EMERGENCIA, NECESSIDADE_ESPECIFICA
) VALUES 
(
    'MARIA SILVA SANTOS', '12345678901', '123456789', '1985-03-15', '11987654321', 
    'maria.silva@email.com', 'Rua das Flores, 123', 'Jardim Paulista', 'São Paulo', 'SP', '01415000',
    'João Silva', '11987654322', 'Necessita de acompanhamento psicológico semanal'
),
(
    'PEDRO HENRIQUE OLIVEIRA', '23456789012', '234567890', '1990-07-22', '11976543210',
    'pedro.oliveira@email.com', 'Avenida Brasil, 456', 'Centro', 'Rio de Janeiro', 'RJ', '20040000',
    'Ana Oliveira', '11976543211', 'Uso regular de medicamentos controlados para hipertensão'
),
(
    'ANA CAROLINA COSTA', '34567890123', '345678901', '1978-11-30', '11965432109',
    'ana.costa@email.com', 'Rua XV de Novembro, 789', 'Batel', 'Curitiba', 'PR', '80420000',
    'Carlos Costa', '11965432110', 'Mobilidade reduzida - necessita de cadeira de rodas'
),
(
    'LUCAS FERNANDES PEREIRA', '45678901234', '456789012', '1995-05-18', '11954321098',
    'lucas.pereira@email.com', 'Rua da Paz, 321', 'Savassi', 'Belo Horizonte', 'MG', '30140000',
    'Fernanda Pereira', '11954321099', 'Dieta especial sem glúten e lactose'
),
(
    'JULIANA ALMEIDA RIBEIRO', '56789012345', '567890123', '1982-09-08', '11943210987',
    'juliana.ribeiro@email.com', 'Avenida Paulista, 1000', 'Bela Vista', 'São Paulo', 'SP', '01310000',
    'Roberto Ribeiro', '11943210988', 'Sessões de fisioterapia 3 vezes por semana'
),
(
    'RAFAEL MENDONÇA SOUZA', '67890123456', '678901234', '1998-12-25', '11932109876',
    'rafael.souza@email.com', 'Rua do Sol, 654', 'Boa Viagem', 'Recife', 'PE', '51021000',
    'Patrícia Souza', '11932109877', 'Acompanhamento para transtorno de ansiedade'
),
(
    'FERNANDA LIMA CASTRO', '78901234567', '789012345', '1975-02-14', '11921098765',
    'fernanda.castro@email.com', 'Alameda Santos, 987', 'Jardins', 'São Paulo', 'SP', '01418000',
    'Ricardo Castro', '11921098766', 'Deficiência visual - necessita de material em braile'
),
(
    'BRUNO MARTINS FERREIRA', '89012345678', '890123456', '1992-08-03', '11910987654',
    'bruno.ferreira@email.com', 'Rua das Palmeiras, 258', 'Moinhos de Vento', 'Porto Alegre', 'RS', '90570000',
    'Camila Ferreira', '11910987655', 'Tratamento renal - sessões de hemodiálise'
),
(
    'CAMILA SANTOS GOMES', '90123456789', '901234567', '1988-04-12', '11909876543',
    'camila.gomes@email.com', 'Avenida Beira Mar, 147', 'Meireles', 'Fortaleza', 'CE', '60165000',
    'Marcos Gomes', '11909876544', 'Suporte para depressão e acompanhamento psiquiátrico'
),
(
    'DIEGO RODRIGUES BARBOSA', '01234567890', '012345678', '1993-06-28', '11998765432',
    'diego.barbosa@email.com', 'Rua da Aurora, 753', 'Santo Amaro', 'Recife', 'PE', '50100000',
    'Tatiane Barbosa', '11998765433', 'Necessita de prótese auditiva e acompanhamento fonoaudiológico'
);

CREATE TABLE IF NOT EXISTS equipamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,  
    nome VARCHAR(150) NOT NULL,
    descricao TEXT,
    patrimonio VARCHAR(50) UNIQUE NOT NULL,
    numero_serie VARCHAR(100) UNIQUE,
    categoria_id INT NOT NULL,
    fornecedor_id INT,
    estado_conservacao ENUM(
        'NOVO',
        'BOM',
        'REGULAR',
        'RUIM'
    ) DEFAULT 'BOM',
    status ENUM(
        'DISPONIVEL',
        'EMPRESTADO',
        'MANUTENCAO',
        'BAIXADO'
    ) DEFAULT 'DISPONIVEL',
    data_aquisicao DATE,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id),
    FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id)
);

INSERT INTO equipamentos
(nome, descricao, patrimonio, numero_serie, categoria_id, fornecedor_id, estado_conservacao, data_aquisicao)
VALUES
('Cadeira de rodas alumínio', 'Cadeira dobrável leve', 'CR001', 'NS-CR-8891', 1, 2, 'NOVO', '2024-03-10'),
('Cadeira de rodas alumínio', 'Cadeira dobrável leve', 'CR002', 'NS-CR-8892', 1, 2, 'NOVO', '2024-03-10'),
('Cadeira de rodas reforçada', 'Suporta até 150kg', 'CR003', 'NS-CR-9011', 1, 1, 'BOM', '2023-11-20'),

('Cadeira de banho inox', 'Resistente à umidade', 'CB001', 'NS-CB-2001', 2, 4, 'NOVO', '2024-01-15'),
('Cadeira de banho inox', 'Resistente à umidade', 'CB002', 'NS-CB-2002', 2, 4, 'BOM', '2024-01-15'),

('Muleta axilar alumínio', 'Altura ajustável', 'MU001', 'NS-MU-3001', 3, 3, 'NOVO', '2024-02-10'),
('Muleta axilar alumínio', 'Altura ajustável', 'MU002', 'NS-MU-3002', 3, 3, 'NOVO', '2024-02-10'),

('Andador articulado', 'Andador dobrável', 'AN001', 'NS-AN-4100', 4, 9, 'NOVO', '2024-01-30'),
('Andador articulado', 'Andador dobrável', 'AN002', 'NS-AN-4101', 4, 9, 'BOM', '2024-01-30'),

('Cama hospitalar manual', 'Cama com ajuste de altura', 'CH001', 'NS-CH-5001', 5, 10, 'BOM', '2023-09-12'),
('Cama hospitalar manual', 'Cama com ajuste de altura', 'CH002', 'NS-CH-5002', 5, 10, 'REGULAR', '2023-09-12');

CREATE TABLE membros (
    nome VARCHAR(100) NOT NULL,
    cpf VARCHAR(11) primary KEY,
    rg VARCHAR(20),
    email VARCHAR(150),
    telefone VARCHAR(20),
    data_nascimento DATE,
    data_ingresso DATE,
    endereco VARCHAR(200),
    bairro VARCHAR(100),
    cidade VARCHAR(100),
    uf CHAR(2) NOT NULL, 
    cep VARCHAR(8),
    cargo VARCHAR(100),
    profissao VARCHAR(100),
    empresa VARCHAR(150)
);

-- Inserção de dados com UF
INSERT INTO membros (
    nome, cpf, rg, email, telefone, data_nascimento, data_ingresso,
    endereco, bairro, cidade, uf, cep, cargo, profissao, empresa
) VALUES
('MARIA SILVA SANTOS', '12345678901', '123456789', 'maria.silva@email.com', '11987654321',
 '1985-03-15', '2023-01-10', 'Rua das Flores, 123', 'Jardim Paulista', 'São Paulo', 'SP', '01415000',
 'Coordenadora', 'Psicóloga', 'Instituto Vida'),
 
('JOÃO CARLOS PEREIRA', '23456789012', '987654321', 'joao.pereira@email.com', '11999887766',
 '1990-07-22', '2022-11-03', 'Av. Paulista, 1500', 'Bela Vista', 'São Paulo', 'SP', '01310000',
 'Supervisor', 'Administrador', 'GlobalCorp'),
 
('ANA BEATRIZ MOURA', '34567890123', '456789123', 'ana.moura@email.com', '11988776655',
 '1992-04-08', '2023-03-15', 'Rua Harmonia, 56', 'Vila Madalena', 'São Paulo', 'SP', '05455000',
 'Secretária', 'Assistente Administrativa', 'HealthPlus'),
 
('CARLOS EDUARDO LIMA', '45678901234', '741258963', 'carlos.lima@email.com', '11977665544',
 '1988-12-01', '2021-09-29', 'Rua dos Pinheiros, 900', 'Pinheiros', 'São Paulo', 'SP', '05422002',
 'Analista', 'Engenheiro de Produção', 'TechWay'),
 
('JULIANA OLIVEIRA', '56789012345', '852369741', 'juliana.oli@email.com', '11966554433',
 '1995-09-17', '2023-02-20', 'Rua Aurora, 200', 'Centro', 'São Paulo', 'SP', '01014000',
 'Assistente Social', 'Assistente Social', 'Casa Solidária'),
 
('MARCOS VINICIUS GOMES', '67890123456', '369147258', 'marcos.vg@email.com', '11955443322',
 '1983-10-30', '2020-06-12', 'Rua Turiassu, 1550', 'Perdizes', 'São Paulo', 'SP', '05005000',
 'Gerente', 'Administrador', 'MegaStore'),
 
('PATRICIA LOPES FERNANDES', '78901234567', '159357456', 'patricia.lf@email.com', '11944332211',
 '1987-02-19', '2021-05-03', 'Av. Rebouças, 2300', 'Jardim América', 'São Paulo', 'SP', '01402001',
 'Consultora', 'Advogada', 'Legal&Co'),
 
('RODRIGO ALMEIDA', '89012345678', '258963147', 'rodrigo.a@email.com', '11933221100',
 '1993-06-10', '2024-01-05', 'Rua Vergueiro, 2200', 'Vila Mariana', 'São Paulo', 'SP', '04102000',
 'Instrutor', 'Professor', 'UniEduca'),
 
('FERNANDA RIBEIRO', '90123456789', '951753852', 'fernanda.r@email.com', '11922110099',
 '1991-01-27', '2022-09-18', 'Av. Sumaré, 1800', 'Sumaré', 'São Paulo', 'SP', '01252000',
 'Especialista', 'Nutricionista', 'GreenLife'),
 
('LEONARDO BARROS', '01234567890', '147258369', 'leonardo.b@email.com', '11911009988',
 '1989-08-14', '2023-04-01', 'Rua Oscar Freire, 900', 'Jardins', 'São Paulo', 'SP', '01426000',
 'Coordenador', 'Designer', 'StudioX');

 CREATE TABLE IF NOT EXISTS fornecedores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo_pessoa ENUM('PF','PJ') NOT NULL,
    nome VARCHAR(150) NOT NULL,
    cpf VARCHAR(14) UNIQUE,
    cnpj VARCHAR(18) UNIQUE,
    telefone VARCHAR(20),
    email VARCHAR(150),
    endereco VARCHAR(150),
    bairro VARCHAR(100),
    cidade VARCHAR(100),
    uf CHAR(2),
    cep CHAR(8),
    status ENUM('ATIVO','INATIVO') DEFAULT 'ATIVO',
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Fornecedores Pessoa Jurídica
INSERT INTO fornecedores (tipo_pessoa, nome, cnpj, telefone, email, endereco, bairro, cidade, uf, cep, status) VALUES
('PJ', 'Órtese e Prótese do Brasil Ltda', '12.345.678/0001-90', '(11) 3456-7890', 'comercial@opbrasil.com.br', 'Av. dos Autonomistas, 1500', 'Vila Yara', 'Osasco', 'SP', '06020010', 'ATIVO'),
('PJ', 'Cadeiras de Rodas Moderna', '23.456.789/0001-01', '(11) 4567-8901', 'vendas@cadeirasmoderna.com.br', 'Rua Vergueiro, 2345', 'Vila Mariana', 'São Paulo', 'SP', '04101300', 'ATIVO'),
('PJ', 'Mobility Importação e Comércio', '34.567.890/0001-12', '(19) 5678-9012', 'contato@mobilityimport.com.br', 'Av. das Indústrias, 500', 'Jardim Planalto', 'Campinas', 'SP', '13050900', 'ATIVO'),
('PJ', 'Ortopedia Técnica Nacional', '45.678.901/0001-23', '(11) 6789-0123', 'vendas@ortopediatecnica.com.br', 'Rua Augusta, 789', 'Consolação', 'São Paulo', 'SP', '01305000', 'ATIVO'),
('PJ', 'Peças e Acessórios para Reabilitação', '56.789.012/0001-34', '(21) 7890-1234', 'pecas@reabilitacao.com.br', 'Av. das Américas, 3500', 'Barra da Tijuca', 'Rio de Janeiro', 'RJ', '22631003', 'ATIVO'),
('PJ', 'Tecnologia Assistiva Distribuidora', '67.890.123/0001-45', '(31) 8901-2345', 'comercial@tecassistiva.com.br', 'Av. do Contorno, 5120', 'Funcionários', 'Belo Horizonte', 'MG', '30110018', 'INATIVO'),
('PJ', 'Ortoponto Materiais Ortopédicos', '78.901.234/0001-56', '(41) 9012-3456', 'vendas@ortoponto.com.br', 'Rua XV de Novembro, 1500', 'Centro', 'Curitiba', 'PR', '80020010', 'ATIVO'),
('PJ', 'Reabilitech Soluções em Mobilidade', '89.012.345/0001-67', '(51) 0123-4567', 'atendimento@reabilitech.com.br', 'Av. Ipiranga, 6681', 'Partenon', 'Porto Alegre', 'RS', '90619900', 'ATIVO'),
('PJ', 'Free Wheelchair Mission Brasil', '90.123.456/0001-78', '(11) 99876-5432', 'projetos@fwmission.org.br', 'Rua Verbo Divino, 1488', 'Santo Amaro', 'São Paulo', 'SP', '04719904', 'ATIVO'),
('PJ', 'Mobility Life Equipamentos', '01.234.567/0001-89', '(11) 98765-4321', 'vendas@mobilitylife.com.br', 'Rua da Acessibilidade, 500', 'Jardim Paulista', 'São Paulo', 'SP', '01415000', 'ATIVO'),
('PJ', 'Orthopeb Ortopedia Técnica', '98.765.432/0001-10', '(19) 97654-3210', 'comercial@orthopeb.com.br', 'Av. Brasil, 200', 'Jardim Guanabara', 'Campinas', 'SP', '13073000', 'INATIVO'),
('PJ', 'Assistech Manutenção de Cadeiras de Rodas', '87.654.321/0001-98', '(19) 96543-2109', 'assistencia@assistech.com.br', 'Av. Francisco Glicério, 400', 'Centro', 'Campinas', 'SP', '13012000', 'ATIVO');

-- Fornecedores Pessoa Física (Técnicos especializados e pequenos prestadores)
INSERT INTO fornecedores (tipo_pessoa, nome, cpf, telefone, email, endereco, bairro, cidade, uf, cep, status) VALUES
('PF', 'João Batista de Oliveira', '123.456.789-01', '(11) 91234-5678', 'joao.tecnicomobilidade@email.com', 'Rua das Flores, 123', 'Jardim das Oliveiras', 'São Paulo', 'SP', '03624010', 'ATIVO'),
('PF', 'Márcio Antunes da Silva', '234.567.890-12', '(11) 92345-6789', 'marcio.equipamentos@email.com', 'Av. Brasil, 456', 'Jardim América', 'São Paulo', 'SP', '01431000', 'ATIVO'),
('PF', 'Roberto Carlos Ferreira', '345.678.901-23', '(19) 93456-7890', 'roberto.ortopedia@email.com', 'Rua XV de Novembro, 789', 'Centro', 'Campinas', 'SP', '13015000', 'INATIVO'),
('PF', 'Maria Aparecida Costa', '456.789.012-34', '(21) 94567-8901', 'maria.tecnicos@email.com', 'Rua da Praia, 234', 'Centro', 'Rio de Janeiro', 'RJ', '20021010', 'ATIVO'),
('PF', 'José Renato Souza', '567.890.123-45', '(31) 95678-9012', 'jose.manutencaocr@email.com', 'Av. Afonso Pena, 567', 'Centro', 'Belo Horizonte', 'MG', '30130000', 'ATIVO'),
('PF', 'Fernanda Cristina Lima', '678.901.234-56', '(41) 96789-0123', 'fernanda.ortopedia@email.com', 'Rua das Araucárias, 890', 'Jardim Social', 'Curitiba', 'PR', '82520000', 'ATIVO'),
('PF', 'Ricardo de Almeida', '789.012.345-67', '(51) 97890-1234', 'ricardo.tecnicopoa@email.com', 'Av. Goethe, 123', 'Rio Branco', 'Porto Alegre', 'RS', '90430000', 'ATIVO'),
('PF', 'Patrícia Gomes Ferreira', '890.123.456-78', '(61) 98901-2345', 'patricia.reabilitacao@email.com', 'SHS Quadra 6, Bloco C', 'Asa Sul', 'Brasília', 'DF', '70322900', 'ATIVO'),
('PF', 'Carlos Eduardo Nascimento', '901.234.567-89', '(11) 99876-5432', 'carlos.ajustes@email.com', 'Rua dos Técnicos, 456', 'Ipiranga', 'São Paulo', 'SP', '04263000', 'ATIVO'),
('PF', 'Ana Beatriz Santos', '012.345.678-90', '(19) 98765-4321', 'ana.adaptacoes@email.com', 'Av. Dr. Moraes Salles, 789', 'Centro', 'Campinas', 'SP', '13010000', 'ATIVO'),
('PF', 'Paulo Henrique Oliveira', '123.456.789-02', '(21) 97654-3210', 'paulo.tecnicorj@email.com', 'Rua Voluntários da Pátria, 321', 'Botafogo', 'Rio de Janeiro', 'RJ', '22270000', 'INATIVO'),
('PF', 'Luciana Mendes Rocha', '234.567.890-23', '(31) 96543-2109', 'luciana.ortopedia@email.com', 'Rua da Bahia, 654', 'Centro', 'Belo Horizonte', 'MG', '30160000', 'ATIVO');

-- Fornecedores adicionais especializados
INSERT INTO fornecedores (tipo_pessoa, nome, cnpj, telefone, email, endereco, bairro, cidade, uf, cep, status) VALUES
('PJ', 'Tecno Mobility Indústria e Comércio', '11.222.333/0001-44', '(11) 95555-1234', 'comercial@tecnomobility.com.br', 'Rua da Indústria, 150', 'Jardim São Paulo', 'São Paulo', 'SP', '02022000', 'ATIVO'),
('PJ', 'Ortoponto Produtos Ortopédicos', '22.333.444/0001-55', '(11) 94444-5678', 'vendas@ortoponto.com.br', 'Av. das Nações, 750', 'Vila Olímpia', 'São Paulo', 'SP', '04555000', 'ATIVO'),
('PJ', 'Adapta Equipamentos sob Medida', '33.444.555/0001-66', '(16) 93333-8901', 'contato@adaptaequipamentos.com.br', 'Rodovia Anhanguera, km 300', 'Jardim Canadá', 'Ribeirão Preto', 'SP', '14090000', 'INATIVO'),
('PJ', 'Reabilitar Técnica em Manutenção', '44.555.666/0001-77', '(19) 92222-3456', 'os@reabilitartecnica.com.br', 'Av. Dr. Antônio Carlos Couto de Barros, 890', 'Parque Industrial', 'Campinas', 'SP', '13069900', 'ATIVO');

CREATE TABLE IF NOT EXISTS categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    descricao TEXT,
    status ENUM('ATIVO','INATIVO') DEFAULT 'ATIVO',
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (nome, tipo)
);

INSERT INTO categorias (nome, tipo, descricao) VALUES
('Cadeira de rodas', 'EQUIPAMENTO', 'Equipamento de mobilidade'),
('Cadeira de banho', 'EQUIPAMENTO', 'Equipamento para higiene'),
('Muleta', 'EQUIPAMENTO', 'Auxílio para locomoção'),
('Andador', 'EQUIPAMENTO', 'Suporte para caminhar'),
('Cama hospitalar', 'EQUIPAMENTO', 'Cama ajustável para pacientes'),
('Manutenção de equipamentos', 'FORNECEDOR', 'Fornecedor que realiza manutenção'),
('Venda de equipamentos', 'FORNECEDOR', 'Fornecedor que vende equipamentos médicos'),
('Venda de peças', 'FORNECEDOR', 'Fornecedor especializado em peças de reposição');

CREATE TABLE emprestimos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    equipamento_id INT NOT NULL,
    beneficiario_cpf CHAR(11) NOT NULL,
    membro_cpf CHAR(11),
    data_emprestimo DATE NOT NULL,
    data_prevista_devolucao DATE,
    data_devolucao DATE,
    status ENUM(
        'ATIVO',
        'DEVOLVIDO',
        'ATRASADO'
    ) DEFAULT 'ATIVO',
    observacoes TEXT,
    data_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (equipamento_id) REFERENCES equipamentos(id),
    FOREIGN KEY (beneficiario_cpf) REFERENCES beneficiarios(cpf),
    FOREIGN KEY (membro_cpf) REFERENCES membros(cpf)
);