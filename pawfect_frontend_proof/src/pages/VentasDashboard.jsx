import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import { Form, Alert } from 'react-bootstrap'

const VentasDashboard = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [sales, setSales] = useState([])
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  // Validar que sea admin o empleado
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return navigate('/login')

    const decoded = jwt_decode(token)
    if (decoded.role !== 'admin' && decoded.role !== 'employee') {
      return navigate('/dashboard')
    }

    setUser(decoded)
  }, [navigate])

  const [errorMessage, setErrorMessage] = useState('')

  // Cargar productos y ventas
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token')
        const headers = { Authorization: `Bearer ${token}` }

        let salesRes = { data: [] }
        let productsRes = { data: [] }

        try {
          salesRes = await axios.get('http://localhost:3000/api/v1/sales', { headers })
        } catch (e) {
          console.error('❌ Error al cargar ventas:', e.response?.data || e.message)
        }

        try {
          productsRes = await axios.get('http://localhost:3000/api/v1/products', { headers })
          setProducts(productsRes.data)
        } catch (e) {
          console.error('❌ Error al cargar productos:', e.response?.data || e.message)
        }

        setSales(salesRes.data)
      } catch (err) {
        console.error('Error al cargar productos o ventas', err)
      }
    }
    fetchData()
  }, [])

  const addToCart = (product) => {
    const existing = cart.find(item => item.product_id === product.product_id)
    if (existing) {
      setCart(cart.map(item =>
        item.product_id === product.product_id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      setCart([...cart, {
        product_id: product.product_id,
        name: product.name,
        price: parseFloat(product.price),
        quantity: 1
      }])
    }
  }

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.product_id !== productId))
  }

  const handleSubmit = async () => {
    if (cart.length === 0) {
setErrorMessage('Agrega productos al carrito antes de registrar la venta')
      return
    }

    const payload = {
userId: user.user_id, // antes estaba como user_id ❌
  items: cart.map(({ product_id, quantity, price }) => ({ product_id, quantity, price }))
    }

    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      await axios.post('http://localhost:3000/api/v1/sales', payload, {
        headers: { Authorization: `Bearer ${token}` }
      })

      setSuccessMessage('Venta registrada con éxito ✅')
      setCart([])

      const updatedSales = await axios.get('http://localhost:3000/api/v1/sales', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setSales(updatedSales.data)
    } catch (err) {
      console.error('Error al registrar venta', err)
setErrorMessage('Ocurrió un error al registrar la venta')
    } finally {
      setLoading(false)
    }
  }

  const productosFiltrados = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container mt-4">
      <h2>🧾 Punto de Venta (POS)</h2>
      <p>Selecciona productos para registrar una venta presencial.</p>
{errorMessage && <Alert variant="danger" className="mt-3">{errorMessage}</Alert>}


      <div className="row">
        <div className="col-md-6">
          <h4>📦 Productos disponibles</h4>
          <Form.Control
            type="text"
            placeholder="Buscar producto..."
            className="mb-3"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <ul className="list-group">
            {productosFiltrados.length === 0 ? (
              <li className="list-group-item">No hay productos disponibles.</li>
            ) : (
              productosFiltrados.map(prod => (
                <li key={prod.product_id} className="list-group-item d-flex justify-content-between align-items-center">
                  {prod.name} — ${prod.price}
                  <button className="btn btn-sm btn-success" onClick={() => addToCart(prod)}>Agregar</button>
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="col-md-6">
          <h4>🛒 Carrito</h4>
          {cart.length === 0 ? (
            <p>No hay productos en el carrito.</p>
          ) : (
            <ul className="list-group">
              {cart.map(item => (
                <li key={item.product_id} className="list-group-item d-flex justify-content-between align-items-center">
                  {item.name} × {item.quantity} — ${item.price * item.quantity}
                  <button className="btn btn-sm btn-danger" onClick={() => removeFromCart(item.product_id)}>Eliminar</button>
                </li>
              ))}
            </ul>
          )}
          <hr />
          <h5>Total: ${cart.reduce((sum, i) => sum + i.quantity * i.price, 0).toFixed(2)}</h5>
          <button className="btn btn-primary mt-2" disabled={loading} onClick={handleSubmit}>
            {loading ? 'Registrando...' : 'Registrar Venta'}
          </button>
          {successMessage && <div className="alert alert-success mt-3">{successMessage}</div>}
        </div>
      </div>

      <hr className="my-4" />
      <h4>📋 Historial de Ventas</h4>
      {sales.length === 0 ? (
        <p>No hay ventas registradas aún.</p>
      ) : (
        <table className="table table-striped mt-2">
          <thead>
            <tr>
              <th>#</th>
              <th>Usuario</th>
              <th>Total</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale, index) => (
              <tr key={sale.id}>
                <td>{index + 1}</td>
                <td>{sale.user_id}</td>
                <td>${parseFloat(sale.total).toFixed(2)}</td>
                <td>{new Date(sale.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default VentasDashboard
