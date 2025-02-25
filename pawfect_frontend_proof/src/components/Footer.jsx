import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer">
      <p>&copy; Creado por Pawfect®. Todos los derechos reservados.</p>
      <div className="social-icons">
        <a href="https://www.facebook.com/profile.php?id=100063668540922"><FaFacebook /></a>
        <a href="#"><FaInstagram /></a>
        <a href="#"><FaTwitter /></a>
      </div>
    </footer>
  );
}

export default Footer;
