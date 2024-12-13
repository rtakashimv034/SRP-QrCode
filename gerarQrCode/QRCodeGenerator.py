import qrcode
from qrcode.image.pure import PyPNGImage


class QRCode:
    def __init__(self):
        self.qr = qrcode.QRCode(
            version=None,
            error_correction=qrcode.constants.ERROR_CORRECT_H,
            box_size=10,
            border=4,
            image_factory=PyPNGImage
        )

    def receber_dados(self, dados):
        self.qr.clear()
        self.qr.add_data(dados)
        self.qr.make(fit=True)

    def gerar_imagem(self, nome):
        self.qr.make_image().save(nome + ".png")
