import PIL.Image
from QRCodeGenerator import QRCode
from pyzbar.pyzbar import decode

dados = "PDT-001"

qr = QRCode()
qr.receber_dados(dados)
qr.gerar_imagem(dados)

conteudo = decode(PIL.Image.open(dados + ".png"))

print(conteudo[0].data)
