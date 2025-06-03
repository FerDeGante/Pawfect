import QRCode from 'qrcode.react';

const QrCode = ({ value }) => (
  <div>
    <QRCode value={value} size={256} />
  </div>
);

export default QrCode;
