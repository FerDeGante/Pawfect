import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const ClientesDashboard = () => {
  const navigate = useNavigate()
  const [reservations, setReservations] = useState([])
  const [payments, setPayments] = useState([])
  const [user, setUser] = useState(null)

  // Validar usuario desde localStorage o token
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'))
    if (!userData || userData.role !== 'owner') {
      navigate('/login')
      return
    }
    setUser(userData)
  }, [navigate])

  // Obtener reservaciones y pagos
  useEffect(() => {
    if (!user) return
    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/v1/reservations/user/${user.user_id}`)
        const pay = await axios.get(`/api/v1/payments/user/${user.user_id}`)
        setReservations(res.data)
        setPayments(pay.data)
      } catch (error) {
        console.error('Error al cargar datos del cliente:', error)
      }
    }
    fetchData()
  }, [user])

  const handlePay = async (reservation) => {
    try {
      const response = await axios.post('/api/v1/stripe/create-checkout-session', {
        amount: 500, // Puedes calcularlo según el tipo de servicio en el futuro
        reservationId: reservation.id,
        user_id: user.user_id
      })

      if (response.data.url) {
        window.location.href = response.data.url
      }
    } catch (error) {
      console.error('Error al crear sesión de Stripe:', error)
    }
  }

  return (
    <div className="container">
      <h2>Mis Reservaciones</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Mascota</th>
            <th>Veterinario</th>
            <th>Estado</th>
            <th>Pago</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map(res => (
            <tr key={res.id}>
              <td>{res.date}</td>
              <td>{res.time}</td>
              <td>{res.pet_name}</td>
              <td>{res.veterinarian_name}</td>
              <td>{res.status}</td>
              <td>
                {res.status === 'pending'
                  ? <button className="btn btn-primary" onClick={() => handlePay(res)}>Pagar</button>
                  : <span className="text-success">Pagado</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className="mt-5">Historial de Pagos</h3>
      <ul>
        {payments.map(p => (
          <li key={p.id}>
            {p.amount} {p.currency?.toUpperCase() || 'MXN'} – {p.method} – {new Date(p.created_at).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ClientesDashboard
