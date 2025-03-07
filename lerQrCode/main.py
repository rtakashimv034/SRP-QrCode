from flask import Flask, request, jsonify
import cv2
from pyzbar import pyzbar
import threading
from flask_cors import CORS
import signal
import sys
from datetime import datetime
import requests
import json


# Variável global para armazenar os QR codes lidos
qrcodes = []  # Lista única para todas as câmeras
product_path = []  # Lista para armazenar os caminhos dos produtos
defective_product_path = [] # Lista para armazenar os produtos defeituosos
PUBLIC = 'srpapp.duckdns.org'
lock = threading.Lock()  # Para evitar problemas de concorrência

# Sinalizador para controlar a execução das threads
running = True

app = Flask(__name__)
CORS(app)

# Variável para armazenar as capturas de vídeo
caps = {}

def read_qr_code(camera_index):
    global qrcodes, running, product_path, defective_product_path
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
        found_defective_produto = None

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
            elif data.startswith('D'): #Supondo que o produto defeituoso começa com 'D':
                found_defective_produto = data

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

        if found_bdj and found_produto:
            with lock:
                # Lista para armazenar todos os caminhos válidos encontrados
                novos_caminhos = []

                # Percorre todas as entradas em qrcodes
                for entry in qrcodes:
                    for bdj in entry["BDJ"]:
                        if bdj["data"] == found_bdj:
                            estacao = entry["ET"]
                            bdj_timestamp = bdj["timestamp"]

                            # Cria um novo caminho
                            novo_caminho = [found_produto, estacao, bdj_timestamp]

                            # Verifica se o caminho já existe (ignorando o timestamp)
                            caminho_existente = any(
                                caminho[0] == found_produto and caminho[1] == estacao
                                for caminho in product_path
                            )

                            # Se o caminho não existir, adiciona à lista de novos caminhos
                            if not caminho_existente:
                                novos_caminhos.append(novo_caminho)

                # Adiciona todos os novos caminhos ao product_path
                if novos_caminhos:
                    product_path.extend(novos_caminhos)
                    print(f"Produto {found_produto} passou pelas estações: {[caminho[1] for caminho in novos_caminhos]}")
                    print(f"Timestamps das bandejas: {[caminho[2] for caminho in novos_caminhos]}")
                    print("Caminho do produto atualizado:", product_path)

                # Remove o BDJ detectado de todas as câmeras
                for entry in qrcodes:
                    entry["BDJ"] = [bdj for bdj in entry["BDJ"] if bdj["data"] != found_bdj]
                
            # Itera sobre cada caminho no product_path
            for path in product_path:
                # Verifica se o caminho tem pelo menos 3 elementos (produto, estação e timestamp)

                if len(path) >= 3:
                    # Cria o dicionário com os dados do caminho
                    dicionario = {
                        "stationIdStr": path[1],  # Estação
                        "prodSN": path[0],        # Produto
                        "registeredAt": path[2],  # Timestamp
                    }

                    try:
                        # Envia a requisição POST para a API
                        response = requests.post(
                            f'http://localhost:3333/api/v1/camera/path',
                            json=dicionario,  # Passa o dicionário diretamente 
                            timeout=10
                        )

                        # Verifica a resposta da API
                        if response.status_code == 201:
                            print("Post criado com sucesso!")
                            print("Resposta do servidor:", response.json())  # Exibe a resposta JSON
                        else:
                            print("Erro ao criar o post:", response.status_code)
                            print("Detalhes:", response.text)  # Exibe a resposta de erro, se houver

                    except requests.exceptions.RequestException as e:
                        # Captura erros específicos de requisição HTTP
                        print("Ocorreu um erro ao enviar os dados para o banco:", str(e))
                    except Exception as e:
                        # Captura outros erros inesperados
                        print("Ocorreu um erro inesperado:", str(e))

            qq = []
            found_produto = None
        
        if found_bdj and found_defective_produto:
            with lock:
                # Lista para armazenar todos os caminhos válidos encontrados
                novos_caminhos = []

                # Percorre todas as entradas em qrcodes
                for entry in qrcodes:
                    for bdj in entry["BDJ"]:
                        if bdj["data"] == found_bdj:
                            estacao = entry["ET"]
                            bdj_timestamp = bdj["timestamp"]

                            # Cria um novo caminho
                            novo_caminho = [found_defective_produto, estacao, bdj_timestamp]

                            # Verifica se o caminho já existe (ignorando o timestamp)
                            caminho_existente = any(
                                caminho[0] == found_defective_produto and caminho[1] == estacao
                                for caminho in defective_product_path
                            )

                            # Se o caminho não existir, adiciona à lista de novos caminhos
                            if not caminho_existente:
                                novos_caminhos.append(novo_caminho)

                # Adiciona todos os novos caminhos ao product_path
                if novos_caminhos:
                    defective_product_path.extend(novos_caminhos)
                    print(f"Produto {found_defective_produto} passou pelas estações: {[caminho[1] for caminho in novos_caminhos]}")
                    print(f"Timestamps das bandejas: {[caminho[2] for caminho in novos_caminhos]}")
                    print("Caminho do produto atualizado:", defective_product_path)

                # Remove o BDJ detectado de todas as câmeras
                for entry in qrcodes:
                    entry["BDJ"] = [bdj for bdj in entry["BDJ"] if bdj["data"] != found_bdj]

            for path in defective_product_path:

                            if len(path) >= 2:
                                dicionario = {
                                    "stationIdStr" : path[1] ,
                                    "defProdIdStr": path[0],
                                    "registeredAt": path[2],
                                }
                            
                            data = json.dumps(dicionario, indent=4)  # Converte o dicionário em JSON
                            print(data)
                            try: 
                                response = requests.post(f'http://localhost:3333/api/v1/camera/defective-path', json=data) # caminho defeituoso 

                                # Verificando a resposta
                                if response.status_code == 201:
                                    print("Post criado com sucesso!")
                                    print("Resposta do servidor:", response.json())  # Exibe a resposta JSON
                                else:
                                    print("Erro ao criar o post:", response.status_code)
                                    print("Detalhes:", response.text)  # Exibe a resposta de erro, se houver
                            except:
                                print("ocorreu um erro para passar os dados para o banco")

            defective_product_path = []
            found_defective_produto = None

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

# # Rota para retornar os QR codes lidos
# @app.route('/api/camera_path')
# def get_qr_codes():
#     global qrcodes, product_path

#     print("Acessando /api/camera_path...")  # Debug
#     print("Conteúdo atual de qrcodes:", qrcodes)  # Debug
#     print("Caminho dos produtos:", product_path)  # Debug

#     result = {
#         "qrcodes": [],
#         "product_path": product_path
#     }

#     for entry in qrcodes:
#         if entry.get("ET") is not None:  # Garante que ET existe e não é None
#             result["qrcodes"].append({
#                 "camera": entry["camera"],
#                 "ET": entry["ET"],
#                 "BDJ": entry.get("BDJ", [])  # Evita erro se BDJ não existir
#             })

#     if result["qrcodes"] or result["product_path"]:
#         print("Retornando dados encontrados:", result)  # Debug
#         return jsonify(result)
#     else:
#         print("Nenhum dado encontrado.")  # Debug
#         return jsonify({"error": "Nenhum dado encontrado"})

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
    app.run(debug=False)