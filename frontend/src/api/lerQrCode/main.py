from flask import Flask
import cv2
import json
from pyzbar.pyzbar import decode
import time

app = Flask(__name__)

@app.route('/api/route')

def qr_code_reader():
    cam = cv2.VideoCapture(0)
    print("Lendo QR Codes... Pressione 'ESC' para sair.")

    qr_codes_detectados = set()
    qr_codes_info = [] 

    while True:
        ret, frame = cam.read()
        if not ret:
            print("Erro ao acessar a câmera.")
            break
        
        qr_codes = decode(frame)

        for qr in qr_codes:
            data = qr.data.decode("utf-8")

            if len(qr_codes_detectados) >= 3:
                qr_codes_detectados.clear()

            if data not in qr_codes_detectados:
                qr_codes_detectados.add(data)
                qr_info = {"data": data}
                qr_codes_info.append(qr_info)
                print(f"QR Code Detectado: {data}")

            

            (x, y, w, h) = qr.rect
            cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
            cv2.putText(frame, data, (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)  

        cv2.imshow("QR Code Reader", frame)

        if cv2.waitKey(1) == 27:
            break

    cam.release()
    cv2.destroyAllWindows()

    return json.dumps(qr_codes_info, indent=4)

qr_codes_json = qr_code_reader()
print(qr_codes_json)

