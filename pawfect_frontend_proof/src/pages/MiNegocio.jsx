import { useEffect, useState } from 'react';
import axios from 'axios';
import { SketchPicker } from 'react-color'; // Asegúrate de importarlo

const MiNegocio = () => {
  const [primaryColor, setPrimaryColor] = useState('#000');
  const [heroContent, setHeroContent] = useState('');
  const [sections, setSections] = useState([]);
  const [logo, setLogo] = useState(null);
  const [statistics, setStatistics] = useState({ products: 0, clients: 0, appointments: 0 });

  useEffect(() => {
    const fetchStatistics = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await axios.get('http://localhost:3000/api/v1/statistics', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStatistics(response.data);
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    };

    fetchStatistics();
  }, []);

  const handleColorChange = (color) => {
    setPrimaryColor(color.hex);
  };

  const handleHeroChange = (e) => {
    setHeroContent(e.target.value);
  };

  const handleSectionChange = (index, content) => {
    const newSections = [...sections];
    newSections[index] = content;
    setSections(newSections);
  };

  const handleAddSection = () => {
    setSections([...sections, '']);
  };

  const handleLogoChange = (e) => {
    setLogo(URL.createObjectURL(e.target.files[0]));
  };

  return (
    <div>
      <h1>Admin Panel</h1>

      <div>
        <h2>Modify Primary Color</h2>
        <SketchPicker color={primaryColor} onChangeComplete={handleColorChange} />
      </div>

      <div>
        <h2>Modify Hero Section</h2>
        <textarea value={heroContent} onChange={handleHeroChange} />
      </div>

      <div>
        <h2>Modify Sections</h2>
        {sections.map((section, index) => (
          <textarea
            key={index}
            value={section}
            onChange={(e) => handleSectionChange(index, e.target.value)}
          />
        ))}
        <button onClick={handleAddSection}>Add Section</button>
      </div>

      <div>
        <h2>Upload Logo</h2>
        <input type="file" onChange={handleLogoChange} />
        {logo && <img src={logo} alt="Logo" style={{ width: '100px', height: '100px' }} />}
      </div>

      <div>
        <h2>Statistics</h2>
        <p>Products: {statistics.products}</p>
        <p>Clients: {statistics.clients}</p>
        <p>Appointments: {statistics.appointments}</p>
      </div>
    </div>
  );
};

export default MiNegocio;
