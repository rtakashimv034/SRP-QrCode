from flask import Flask
import cv2
from pyzbar import pyzbar
import threading

app = Flask(__name__)

@app.route('/api/route')

def read_qr_code(camera_index):
    cap = cv2.VideoCapture(camera_index)
    if not cap.isOpened():
        print(f"Erro ao abrir a câmera {camera_index}.")
        return

    print(f"Câmera {camera_index} iniciada.")
    while True:
        ret, frame = cap.read()
        if not ret:
            print(f"Erro ao capturar imagem da câmera {camera_index}.")
            break

        decoded_objects = pyzbar.decode(frame)
        for obj in decoded_objects:
            print(f"Conteúdo do QR code da câmera {camera_index}: {obj.data.decode('utf-8')}")

        cv2.imshow(f'Camera {camera_index}', frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyWindow(f'Camera {camera_index}')

camera_indices = [0, 1]

threads = []
for index in camera_indices:
    thread = threading.Thread(target=read_qr_code, args=(index,))
    thread.start()
    threads.append(thread)

for thread in threads:
    thread.join()
