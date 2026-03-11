import mysql2 from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();
// Permite usar um banco de dados separado para testes, 
// evitando interferir nos dados reais durante o desenvolvimento e testes automatizados.
const database = process.env.NODE_ENV === "test" ? "rotarydb_test" : process.env.DB_NAME;

const pool = mysql2.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: database,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// testar conexão
pool
  .getConnection()
  .then((connection) => {
    console.log("Conexão com o banco de dados MySQL estabelecida com sucesso.");
    connection.release();
  })
  .catch((error) => {
    console.error("Erro ao conectar ao banco de dados MySQL:", error);
  });

export default pool;
