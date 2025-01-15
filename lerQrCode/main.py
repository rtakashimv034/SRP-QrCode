import cv2
from pyzbar.pyzbar import decode


def qr_code_reader():
    cam = cv2.VideoCapture(0)

    print("Lendo QR Codes... Pressione 'ESC' para sair.")

    while True:
        ret, frame = cam.read()
        if not ret:
            print("Erro ao acessar a câmera.")
            break
        qr_codes = decode(frame)

        for qr in qr_codes:
            data = qr.data.decode("utf-8")
            print(f"QR Code Detectado: {data}")
            (x, y, w, h) = qr.rect
            cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
            cv2.putText(frame, data, (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

        cv2.imshow("QR Code Reader", frame)

        if cv2.waitKey(1) == 27:
            break

    cam.release()
    cv2.destroyAllWindows()


qr_code_reader()
