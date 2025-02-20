from flask import Flask, request, jsonify
import cv2
from pyzbar import pyzbar
import threading
from flask_cors import CORS
import signal
import sys
from datetime import datetime


# Variável global para armazenar os QR codes lidos
qrcodes = []  # Lista única para todas as câmeras
product_path = []  # Lista para armazenar os caminhos dos produtos
lock = threading.Lock()  # Para evitar problemas de concorrência

# Sinalizador para controlar a execução das threads
running = True

app = Flask(__name__)
CORS(app)

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

# Variável para armazenar as capturas de vídeo
caps = {}

def read_qr_code(camera_index):
    global qrcodes, running, product_path
    cap = cv2.VideoCapture(camera_index, cv2.CAP_DSHOW)
    
    if not cap.isOpened():
        print(f"Erro ao abrir a câmera {camera_index}.")
        return

    caps[camera_index] = cap  # Armazena a captura da câmera
    print(f"Câmera {camera_index} iniciada.")

    window_name = f'Camera {camera_index}'
    cv2.namedWindow(window_name, cv2.WINDOW_NORMAL)

    while running:
        ret, frame = cap.read()
        if not ret:
            print(f"Erro ao capturar imagem da câmera {camera_index}.")
            break

        # Decodifica os QR Codes na imagem
        decoded_objects = pyzbar.decode(frame)
        found_bdj = None
        found_produto = None

        for obj in decoded_objects:
            data = obj.data.decode('utf-8')
            rect = obj.rect  # Pega as coordenadas do QR Code

            # Desenha um retângulo ao redor do QR Code
            cv2.rectangle(frame, 
                          (rect.left, rect.top), 
                          (rect.left + rect.width, rect.top + rect.height), 
                          (0, 255, 0), 2)  # Cor verde, espessura 2

            # Escreve o conteúdo do QR Code acima do retângulo
            cv2.putText(frame, data, 
                        (rect.left, rect.top - 10), 
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

            # Identificar BDJ e Produto
            if data.startswith('B'):  # Supondo que BDJ começa com 'B'
                found_bdj = data
            elif data.startswith('P'):  # Supondo que Produto começa com 'P'
                found_produto = data

            with lock:
                camera_entry = next((entry for entry in qrcodes if entry["camera"] == camera_index), None)
                if not camera_entry:
                    camera_entry = {"camera": camera_index, "ET": None, "BDJ": []}
                    qrcodes.append(camera_entry)

                if data.startswith('E') and camera_entry["ET"] is None:
                    camera_entry["ET"] = data
                    print(f"Câmera {camera_index}: ET detectado - {data}")

                elif not data.startswith('E') and not data.startswith('P'):
                    now = datetime.now()
                    timestamp = now.strftime("%Y-%m-%d %H:%M:%S")
                    bdj_entry = {"data": data, "timestamp": timestamp}
                    if not any(bdj["data"] == data for bdj in camera_entry["BDJ"]):
                        camera_entry["BDJ"].append(bdj_entry)
                        print(f"Câmera {camera_index}: BDJ detectado - {data} ({timestamp})")

        # Verifica se BDJ e Produto foram lidos no mesmo frame
        if found_bdj and found_produto:
            print(f"[!] Câmera {camera_index}: BDJ ({found_bdj}) e Produto ({found_produto}) DETECTADOS SIMULTANEAMENTE!")

            with lock:
                # Encontra a estação (ET) associada ao BDJ
                estacao = None
                bdj_timestamp = None
                for entry in qrcodes:
                    for bdj in entry["BDJ"]:
                        if bdj["data"] == found_bdj:
                            estacao = entry["ET"]
                            bdj_timestamp = bdj["timestamp"]  # Timestamp da bandeja
                            break

                # Adiciona o par [produto, estacao, timestamp_adicao, timestamp_bandeja] ao product_path, se não existir
                if estacao and bdj_timestamp:
                    now = datetime.now()
                    timestamp_adicao = now.strftime("%Y-%m-%d %H:%M:%S")  # Timestamp de adição
                    novo_caminho = [found_produto, estacao, timestamp_adicao, bdj_timestamp]

                    # Verifica se o caminho já existe (ignorando os timestamps)
                    if not any(caminho[0] == found_produto and caminho[1] == estacao for caminho in product_path):
                        product_path.append(novo_caminho)
                        print(f"Produto {found_produto} passou pela estação {estacao}.")
                        print(f"Timestamp de adição: {timestamp_adicao}, Timestamp da bandeja: {bdj_timestamp}")
                        print("Caminho do produto atualizado:", product_path)

                # Remove o BDJ detectado de todas as câmeras
                for entry in qrcodes:
                    entry["BDJ"] = [bdj for bdj in entry["BDJ"] if bdj["data"] != found_bdj]

        # Exibe a imagem da câmera com os retângulos
        cv2.imshow(window_name, frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyWindow(window_name)

# Verifica quais câmeras estão disponíveis
camera_indices = []
for i in range(2):  # Verifica apenas as câmeras 0 e 1
    cap = cv2.VideoCapture(i, cv2.CAP_DSHOW)
    if cap.isOpened():
        camera_indices.append(i)
        cap.release()

# Inicia as threads para cada câmera disponível
threads = []
for index in camera_indices:
    thread = threading.Thread(target=read_qr_code, args=(index,))
    thread.daemon = True
    thread.start()
    threads.append(thread)

# Rota para retornar os QR codes lidos
@app.route('/api/camera_path')
def get_qr_codes():
    global qrcodes, product_path

    print("Acessando /api/camera_path...")  # Debug
    print("Conteúdo atual de qrcodes:", qrcodes)  # Debug
    print("Caminho dos produtos:", product_path)  # Debug

    result = {
        "qrcodes": [],
        "product_path": product_path
    }

    for entry in qrcodes:
        if entry.get("ET") is not None:  # Garante que ET existe e não é None
            result["qrcodes"].append({
                "camera": entry["camera"],
                "ET": entry["ET"],
                "BDJ": entry.get("BDJ", [])  # Evita erro se BDJ não existir
            })

    if result["qrcodes"] or result["product_path"]:
        print("Retornando dados encontrados:", result)  # Debug
        return jsonify(result)
    else:
        print("Nenhum dado encontrado.")  # Debug
        return jsonify({"error": "Nenhum dado encontrado"})

# Função para encerrar o servidor corretamente
def shutdown(signum, frame):
    global running

    print("\nRecebido sinal de interrupção. Encerrando...")

    # Para as threads
    running = False

    # Libera os recursos das câmeras
    for camera_index, cap in caps.items():
        if cap.isOpened():
            cap.release()
            print(f"Câmera {camera_index} liberada.")

    # Fecha as janelas do OpenCV
    cv2.destroyAllWindows()

    # Encerra o programa
    sys.exit(0)

# Captura o sinal de interrupção (Ctrl+C)
signal.signal(signal.SIGINT, shutdown)

# Inicia o servidor Flask
if __name__ == '__main__':
    print("Servidor Flask iniciado.")
    app.run(debug=False)