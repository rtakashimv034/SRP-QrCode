import cv2


def qr_code_reader():
    cam = cv2.VideoCapture(0)
    qr_detector = cv2.QRCodeDetector()

    print("Lendo QR Code... Pressione 'ESC' para sair.")

    while True:
        ret, frame = cam.read()
        if not ret:
            print("Erro ao acessar a câmera.")
            break

        data, bbox, _ = qr_detector.detectAndDecode(frame)

        if bbox is not None:
            for i in range(len(bbox[0])):
                pt1 = tuple(map(int, bbox[0][i]))
                pt2 = tuple(map(int, bbox[0][(i + 1) % len(bbox[0])]))
                cv2.line(frame, pt1, pt2, color=(0, 255, 0), thickness=2)

        if data:
            print(f"QR Code Detectado: {data}")
            cv2.putText(frame, f"QR Code: {data}", (10, 50), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)

        cv2.imshow("QR Code Reader", frame)

        if cv2.waitKey(1) == 27:
            break

    cam.release()
    cv2.destroyAllWindows()


qr_code_reader()
