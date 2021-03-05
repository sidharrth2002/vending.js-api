import QRCode from 'qrcode';

const generateQR = async(text, machineID)  => {
    try {
        await QRCode.toFile(`./${machineID}.png`, text);
    } catch (err) {
      console.error(err)
    }
}

module.exports = generateQR;