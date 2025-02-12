from flask import Flask, request, jsonify
import psycopg2

app = Flask(__name__)

# Configuração do banco de dados PostgreSQL
DB_CONFIG = {
    "dbname": "meu_banco",
    "user": "meu_usuario",
    "password": "minha_senha",
    "host": "localhost",
    "port": "5432"
}

# Criando conexão com o banco de dados
def conectar_bd():
    return psycopg2.connect(**DB_CONFIG)

@app.route('/adicionar_usuario', methods=['POST'])
def adicionar_usuario():
    try:
        dados = request.json  # Recebe os dados da requisição POST
        nome = dados.get("nome")
        email = dados.get("email")

        if not nome or not email:
            return jsonify({"erro": "Nome e email são obrigatórios"}), 400

        conexao = conectar_bd()
        cursor = conexao.cursor()

        # Inserir dados no banco
        cursor.execute("INSERT INTO usuarios (nome, email) VALUES (%s, %s)", (nome, email))
        conexao.commit()

        cursor.close()
        conexao.close()

        return jsonify({"mensagem": "Usuário adicionado com sucesso!"}), 201

    except Exception as e:
        return jsonify({"erro": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
