from flask import Flask, jsonify
import cv2
from pyzbar import pyzbar
import threading
from flask_cors import CORS
import signal
import sys

# Variável global para armazenar os QR codes lidos
qrcodes = []  # Lista única para todas as câmeras
lock = threading.Lock()  # Para evitar problemas de concorrência

# Sinalizador para controlar a execução das threads
running = True

app = Flask(__name__)
CORS(app)

# Variável para armazenar as capturas de vídeo
caps = {}

def read_qr_code(camera_index):
    global qrcodes, running
    cap = cv2.VideoCapture(camera_index, cv2.CAP_DSHOW)  # Usa o backend DSHOW no Windows
    if not cap.isOpened():
        print(f"Erro ao abrir a câmera {camera_index}.")
        return

    # Armazena a captura de vídeo no dicionário
    caps[camera_index] = cap

    print(f"Câmera {camera_index} iniciada.")
    window_name = f'Camera {camera_index}'
    cv2.namedWindow(window_name, cv2.WINDOW_NORMAL)

    while running:  # Verifica o sinalizador running
        ret, frame = cap.read()
        if not ret:
            print(f"Erro ao capturar imagem da câmera {camera_index}.")
            break

        # Decodifica os QR codes na imagem
        decoded_objects = pyzbar.decode(frame)
        for obj in decoded_objects:
            data = obj.data.decode('utf-8')
            with lock:  # Adquire o lock antes de modificar qrcodes
                # Verifica se já existe uma entrada para essa câmera
                camera_entry = next((entry for entry in qrcodes if entry["camera"] == camera_index), None)

                if not camera_entry:  # Se não existir, cria uma nova entrada
                    camera_entry = {"camera": camera_index, "ET": None, "BDJ": None}
                    qrcodes.append(camera_entry)

                # Atualiza ET ou BDJ, dependendo do conteúdo do QR code
                if data.startswith('E') and camera_entry["ET"] is None:
                    camera_entry["ET"] = data
                    print(f"Câmera {camera_index}: ET detectado - {data}")
                elif not data.startswith('E') and camera_entry["BDJ"] is None:
                    camera_entry["BDJ"] = data
                    print(f"Câmera {camera_index}: BDJ detectado - {data}")

        # Exibe a imagem da câmera
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
    global qrcodes
    with lock:  # Adquire o lock antes de acessar qrcodes
        result = []
        for entry in qrcodes:
            if entry["ET"] is not None and entry["BDJ"] is not None:  # Apenas câmeras com ET e BDJ
                result.append({
                    "camera": entry["camera"],
                    "ET": entry["ET"],
                    "BDJ": entry["BDJ"]
                })
        if result:
            return jsonify(result)
        else:
            return jsonify({"error": "QR codes não encontrados"})

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