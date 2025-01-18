export function generateQRCode(inputText) {
	const qrOutput = document.getElementById('qr-output');
	qrOutput.innerHTML = '';
	const qrCode = new QRCode(qrOutput, {
			text: inputText,
			width: 128,
			height: 128,
	});
}

export function toggleQRCode() {
	const qrDiv = document.getElementById('qrGenerator');
	qrDiv.style.display = (qrDiv.style.display === 'none' ? 'block' : 'none');
}
