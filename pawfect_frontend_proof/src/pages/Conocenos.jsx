import React from "react";
import "../styles/styles.sass";

function Conocenos() {
  return (
    <div className="conocenos-container">
      <h1>Sobre Nosotros</h1>
      <p>
        En <strong>Guaus & Miaus</strong>, llevamos más de <strong>10 años</strong> brindando atención veterinaria de calidad y amorosa a las mascotas de nuestra comunidad. Desde nuestros inicios, nuestro compromiso ha sido el bienestar de los animales y la tranquilidad de sus dueños.
      </p>
      <p>
        Contamos con un equipo de veterinarios altamente capacitados, tecnología avanzada y un ambiente diseñado para el confort de cada paciente. Nuestro enfoque integral abarca desde consultas generales hasta cirugías especializadas, siempre con un trato humano y profesional.
      </p>
      <p>
        Creemos que cada mascota merece cuidados de primer nivel, por eso ofrecemos programas de medicina preventiva, diagnóstico avanzado y servicios de bienestar como peluquería y hospedaje. Nos enorgullece haber sido parte de tantas historias felices y seguiremos trabajando por la salud de cada mascota que nos visite.
      </p>
      <img src="/images/clinica.jpg" alt="Nuestra Clínica" className="conocenos-img" />
    </div>
  );
}

export default Conocenos;
