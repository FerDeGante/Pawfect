import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const VeterinarioDashboard = () => {
  const navigate = useNavigate()
  const [reservations, setReservations] = useState([])
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'))
    if (!userData || userData.role !== 'veterinarian') {
      navigate('/login')
      return
    }
    setUser(userData)
  }, [navigate])

  useEffect(() => {
    if (!user) return
    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/v1/reservations/vet/${user.user_id}`)
        setReservations(res.data)
      } catch (error) {
        console.error('Error al cargar agenda del veterinario:', error)
      }
    }
    fetchData()
  }, [user])

  return (
    <div className="container">
      <h2>Agenda del Día</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Mascota</th>
            <th>Dueño</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map(res => (
            <tr key={res.id}>
              <td>{res.date}</td>
              <td>{res.time}</td>
              <td>{res.pet_name}</td>
              <td>{res.owner_name}</td>
              <td>{res.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default VeterinarioDashboard
