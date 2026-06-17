import { useEffect, useState } from "react";

const IMAGENES_PRODUCTOS = {
  "Sudadera \"Ctrl + Z\"": "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=600&q=80", // Sudadera urbana oscura
  "Taza \"Fixing Bug\"": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80", // Taza de café Minimalista/Developer junto a teclado
  "Playera \"Senior Dev\"": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80" // Playera negra limpia
};

const IMAGEN_DE_RESPALDO = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80";

function App() {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [vista, setVista] = useState("tienda"); // "tienda" o "admin"
  
  const [mostrandoLoginAdmin, setMostrandoLoginAdmin] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [errorPassword, setErrorPassword] = useState(false);

  const [mostrandoPasarela, setMostrandoPasarela] = useState(false);
  const [tarjetaNombre, setTarjetaNombre] = useState("");
  const [tarjetaNumero, setTarjetaNumero] = useState("");
  const [tarjetaExp, setTarjetaExp] = useState("");
  const [tarjetaCvv, setTarjetaCvv] = useState("");
  const [tarjetaCp, setTarjetaCp] = useState(""); 
  
  const [procesandoPago, setProcesandoPago] = useState(false);
  const [pagoExitoso, setPagoExitoso] = useState(false);

  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoPrecio, setNuevoPrecio] = useState("");

  useEffect(() => {
    fetch("https://cors-anywhere.herokuapp.com/https://ryusuiseikuken.com/api/productos.php")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error en la respuesta del servidor proxy");
        }
        return response.json();
      })
      .then((data) => setProductos(data))
      .catch((error) => console.error("Error al conectar con la API:", error));
  }, []);

  const agregarAlCarrito = (producto) => {
    setCarrito([...carrito, producto]);
  };

  const eliminarDelCarrito = (indexInput) => {
    setCarrito(carrito.filter((_, index) => index !== indexInput));
  };

  const calcularTotal = () => {
    return carrito.reduce((acc, item) => acc + parseFloat(item.price || item.precio || 0), 0);
  };

  const manejarAccesoAdmin = () => {
    if (vista === "admin") {
      setVista("tienda");
    } else {
      setMostrandoLoginAdmin(true);
      setPasswordInput("");
      setErrorPassword(false);
    }
  };

  const verificarPasswordAdmin = (e) => {
    e.preventDefault();
    if (passwordInput === "admin123") {
      setVista("admin");
      setMostrandoLoginAdmin(false);
      setErrorPassword(false);
    } else {
      setErrorPassword(true);
    }
  };

  const abrirPasarelaStripe = () => {
    setMostrandoPasarela(true);
    setTarjetaNombre("");
    setTarjetaNumero("");
    setTarjetaExp("");
    setTarjetaCvv("");
    setTarjetaCp("");
  };

  const procesarFormularioPago = (e) => {
    e.preventDefault();
    setProcesandoPago(true);
    setTimeout(() => {
      setProcesandoPago(false);
      setMostrandoPasarela(false);
      setPagoExitoso(true);
      setCarrito([]); 
    }, 2500);
  };

  const agregarProductoSimulado = (e) => {
    e.preventDefault();
    if (!nuevoNombre || !nuevoPrecio) return;
    const nuevoProd = {
      id: productos.length + 1,
      nombre: nuevoNombre,
      precio: nuevoPrecio,
      descripcion: "Producto agregado desde el panel de control.",
      categoria: "NUEVO",
      imagen_url: ""
    };
    setProductos([...productos, nuevoProd]);
    setNuevoNombre("");
    setNuevoPrecio("");
  };

  const obtenerImagenProducto = (prod) => {
    if (IMAGENES_PRODUCTOS[prod.nombre]) {
      return IMAGENES_PRODUCTOS[prod.nombre];
    }
    if (prod.imagen_url && prod.imagen_url.trim() !== "") {
      return prod.imagen_url;
    }
    return IMAGEN_DE_RESPALDO;
  };

  return (
    <div className="bg-zinc-950 text-zinc-100 min-h-screen font-mono p-0 m-0 relative">
      
      <nav className="border-b border-emerald-500/30 bg-zinc-900 px-6 py-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-4">
          <span className="text-xl font-black tracking-wider text-emerald-400">
            [!] ERROR 404: WEAR
          </span>
          <button 
            onClick={manejarAccesoAdmin}
            className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 px-3 py-1 rounded transition-colors"
          >
            {vista === "tienda" ? "⚙️ Ir a Admin" : "🛒 Ir a Tienda"}
          </button>
        </div>
        <div className="bg-emerald-500 text-black text-xs font-bold px-3 py-1 rounded-full uppercase">
          Items Carrito: {carrito.length}
        </div>
      </nav>

      {vista === "tienda" && (
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          <div className="lg:col-span-3">
            <header className="text-center md:text-left mb-8">
              <h1 className="text-3xl font-extrabold text-white mb-2 uppercase">
                Sistemas caídos, <span className="text-emerald-400">estilo elevado</span>.
              </h1>
              <p className="text-zinc-400 text-xs">Modo Cliente activo - Producción en Web.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {productos.length === 0 ? (
                <div className="col-span-2 text-center py-12 border border-dashed border-zinc-800 rounded-xl">
                  <p className="text-zinc-500 text-sm animate-pulse">Cargando base de datos relacional...</p>
                </div>
              ) : (
                productos.map((prod) => (
                  <div key={prod.id} className="border border-zinc-800 bg-zinc-900 rounded-xl overflow-hidden hover:border-emerald-500/30 transition-all duration-300 flex flex-col justify-between">
                    <div className="relative aspect-video bg-zinc-950 flex items-center justify-center border-b border-zinc-800">
                      <img 
                        src={obtenerImagenProducto(prod)} 
                        alt={prod.nombre} 
                        className="w-full h-full object-cover opacity-75 hover:opacity-90 transition-opacity duration-300" 
                      />
                      <span className="absolute top-3 right-3 bg-black/80 text-emerald-400 text-xs font-bold px-2 py-0.5 rounded uppercase border border-emerald-500/20">
                        {prod.categoria || "Garm"}
                      </span>
                    </div>
                    <div className="p-5">
                      <h2 className="text-lg font-bold text-white">{prod.nombre}</h2>
                      <p className="text-zinc-400 text-xs mt-2">{prod.descripcion}</p>
                    </div>
                    <div className="p-5 pt-0">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-zinc-500 text-xs">Precio</span>
                        <span className="text-lg font-black text-emerald-400">${prod.price || prod.precio} MXN</span>
                      </div>
                      <button 
                        onClick={() => agregarAlCarrito(prod)}
                        className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-2 rounded-lg transition-colors duration-200 uppercase text-xs tracking-wider"
                      >
                        Añadir al Carrito
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="border border-zinc-800 bg-zinc-900 p-6 rounded-xl h-fit">
            <h2 className="text-sm font-bold text-emerald-400 uppercase tracking-widest border-b border-zinc-800 pb-3 mb-4">
              // Detalles del Carrito
            </h2>

            {carrito.length === 0 ? (
              <p className="text-zinc-500 text-xs text-center py-6">El carrito está vacío.</p>
            ) : (
              <div className="space-y-3 max-h-60 overflow-y-auto mb-4 pr-1">
                {carrito.map((item, index) => (
                  <div key={index} className="flex justify-between items-center bg-zinc-950 p-2 rounded border border-zinc-800 text-xs">
                    <div>
                      <p className="text-white font-bold truncate max-w-[120px]">{item.nombre}</p>
                      <p className="text-emerald-400">${item.price || item.precio}</p>
                    </div>
                    <button 
                      onClick={() => eliminarDelCarrito(index)}
                      className="text-red-400 hover:text-red-300 px-2"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="border-t border-zinc-800 pt-4 mt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-zinc-400 text-xs uppercase">Total:</span>
                <span className="text-xl font-black text-white">${calcularTotal()} MXN</span>
              </div>

              {carrito.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">// Checkout Simulado:</p>
                  <button 
                    onClick={abrirPasarelaStripe}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs py-2.5 rounded uppercase tracking-wider transition-colors shadow-lg shadow-emerald-500/10"
                  >
                    Pagar con Stripe
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {vista === "admin" && (
        <div className="max-w-5xl mx-auto px-6 py-12">
          <header className="mb-8">
            <h1 className="text-2xl font-black text-red-500 uppercase tracking-widest">
              [⚙️] PANEL DE ADMINISTRACIÓN
            </h1>
            <p className="text-zinc-400 text-xs">Consola interna de gestión de inventario para Error 404: Wear.</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border border-zinc-800 bg-zinc-900 p-6 rounded-xl h-fit">
              <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">// Registrar Producto</h3>
              <form onSubmit={agregarProductoSimulado} className="space-y-4">
                <div>
                  <label className="block text-[10px] text-zinc-400 uppercase mb-1">Nombre del artículo</label>
                  <input 
                    type="text" 
                    value={nuevoNombre}
                    onChange={(e) => setNuevoNombre(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-xs text-white focus:outline-none focus:border-red-500"
                    placeholder="Ej. Sudadera 'NullPointer'"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-zinc-400 uppercase mb-1">Precio (MXN)</label>
                  <input 
                    type="number" 
                    value={nuevoPrecio}
                    onChange={(e) => setNuevoPrecio(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-xs text-white focus:outline-none focus:border-red-500"
                    placeholder="399"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-2 rounded text-xs uppercase"
                >
                  Insertar en Vista Local
                </button>
              </form>
            </div>

            <div className="md:col-span-2 border border-zinc-800 bg-zinc-900 p-6 rounded-xl">
              <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">// Inventario en Memoria ({productos.length})</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-zinc-300">
                  <thead className="bg-zinc-950 text-[10px] text-zinc-500 uppercase tracking-wider border-b border-zinc-800">
                    <tr>
                      <th className="p-3">ID</th>
                      <th className="p-3">Nombre</th>
                      <th className="p-3">Categoría</th>
                      <th className="p-3 text-right">Precio</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/50">
                    {productos.map((p) => (
                      <tr key={p.id} className="hover:bg-zinc-950/40">
                        <td className="p-3 text-zinc-500">#{p.id}</td>
                        <td className="p-3 font-bold text-white">{p.nombre}</td>
                        <td className="p-3"><span className="bg-zinc-800 px-2 py-0.5 rounded text-[10px]">{p.categoria || "NUEVO"}</span></td>
                        <td className="p-3 text-right text-emerald-400 font-bold">${p.price || p.precio}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {mostrandoLoginAdmin && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 border border-zinc-700 p-6 rounded-xl max-w-sm w-full shadow-2xl">
            <div className="text-center mb-4">
              <span className="text-2xl">🔒</span>
              <h3 className="text-sm font-bold text-white uppercase tracking-widest mt-2">Acceso de Seguridad</h3>
              <p className="text-[10px] text-zinc-500 uppercase mt-1">Consola restringida</p>
            </div>
            <form onSubmit={verificarPasswordAdmin} className="space-y-4">
              <div>
                <label className="block text-[10px] text-zinc-400 uppercase mb-1">Clave de Acceso</label>
                <input 
                  type="password" 
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-sm text-center tracking-widest text-white focus:outline-none focus:border-emerald-500"
                  placeholder="••••••••"
                  autoFocus
                />
                {errorPassword && (
                  <p className="text-red-400 text-[10px] uppercase mt-1 text-center font-bold">⚠️ Credencial inválida.</p>
                )}
              </div>
              <div className="flex gap-2">
                <button 
                  type="button"
                  onClick={() => setMostrandoLoginAdmin(false)}
                  className="w-1/2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-xs font-bold py-2 rounded uppercase"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="w-1/2 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold py-2 rounded uppercase"
                >
                  Verificar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {mostrandoPasarela && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-40">
          <div className="bg-zinc-900 text-zinc-800 rounded-3xl max-w-sm w-full shadow-2xl overflow-hidden border border-zinc-800 flex flex-col font-sans">
            
            <div className="bg-zinc-100 px-4 py-4 flex items-center border-b border-zinc-200">
              <button 
                type="button"
                onClick={() => setMostrandoPasarela(false)}
                className="w-8 h-8 bg-white text-zinc-700 font-bold rounded-full flex items-center justify-center shadow-sm hover:bg-zinc-50 transition-colors"
              >
                ‹
              </button>
              <div className="flex items-center gap-2 ml-4">
                <div className="w-7 h-7 bg-zinc-400 rounded-lg flex items-center justify-center text-white text-xs">
                  💳
                </div>
                <span className="text-base font-bold text-teal-900">Agregar tarjeta</span>
              </div>
            </div>

            <div className="bg-zinc-50 px-6 py-2 border-b border-zinc-100 text-left">
              <span className="text-xs font-bold text-zinc-500 tracking-wide">Método de pago</span>
            </div>

            <form onSubmit={procesarFormularioPago} className="p-6 bg-white space-y-4 flex-1">
              <div>
                <input 
                  type="text" 
                  required
                  value={tarjetaNombre}
                  onChange={(e) => setTarjetaNombre(e.target.value)}
                  className="w-full bg-white border border-zinc-300 rounded-2xl p-3.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-teal-600 transition-all font-medium shadow-inner"
                  placeholder="Nombre del titular"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input 
                    type="password" 
                    required
                    maxLength="3"
                    value={tarjetaCvv}
                    onChange={(e) => setTarjetaCvv(e.target.value)}
                    className="w-full bg-white border border-zinc-300 rounded-2xl p-3.5 text-sm text-zinc-900 placeholder-zinc-400 text-center focus:outline-none focus:border-teal-600 transition-all font-medium shadow-inner"
                    placeholder="CVV"
                  />
                </div>
                <div>
                  <input 
                    type="text" 
                    required
                    maxLength="5"
                    value={tarjetaExp}
                    onChange={(e) => setTarjetaExp(e.target.value)}
                    className="w-full bg-white border border-zinc-300 rounded-2xl p-3.5 text-sm text-zinc-900 placeholder-zinc-400 text-center focus:outline-none focus:border-teal-600 transition-all font-medium shadow-inner"
                    placeholder="MM/AA"
                  />
                </div>
              </div>

              <div>
                <input 
                  type="text" 
                  required
                  maxLength="19"
                  value={tarjetaNumero}
                  onChange={(e) => setTarjetaNumero(e.target.value)}
                  className="w-full bg-white border border-zinc-300 rounded-2xl p-3.5 text-sm text-zinc-900 placeholder-zinc-400 tracking-widest focus:outline-none focus:border-teal-600 transition-all font-medium shadow-inner"
                  placeholder="Número de tarjeta"
                />
              </div>

              <div>
                <input 
                  type="text" 
                  required
                  maxLength="5"
                  value={tarjetaCp}
                  onChange={(e) => setTarjetaCp(e.target.value)}
                  className="w-full bg-white border border-zinc-300 rounded-2xl p-3.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-teal-600 transition-all font-medium shadow-inner"
                  placeholder="Código Postal (CP)"
                />
              </div>

              <div className="bg-zinc-50 border border-zinc-200 p-3 rounded-2xl flex justify-between items-center text-xs mt-2 px-4">
                <span className="text-zinc-500 font-bold uppercase tracking-wider text-[10px]">Monto Total:</span>
                <span className="text-teal-700 font-black text-sm">${calcularTotal()} MXN</span>
              </div>

              <div className="pt-2">
                {procesandoPago ? (
                  <div className="w-full bg-teal-700/80 text-white text-sm font-bold py-3.5 rounded-2xl text-center flex items-center justify-center gap-2 uppercase tracking-wider">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Validando...
                  </div>
                ) : (
                  <button 
                    type="submit"
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 rounded-2xl text-base tracking-wide transition-all shadow-md active:scale-95"
                  >
                    Pagar
                  </button>
                )}
              </div>

              <div className="flex flex-col items-center justify-center pt-4 border-t border-zinc-100">
                <span className="text-[10px] text-zinc-400 font-bold tracking-wider uppercase mb-1">stripe gateway</span>
                <div className="flex gap-2 bg-zinc-50 border border-zinc-200 p-1.5 rounded-lg px-3">
                  <span className="text-[10px] font-black text-blue-800">VISA</span>
                  <span className="text-[10px] font-black text-red-600">MasterCard</span>
                  <span className="text-[10px] font-black text-blue-600">Amex</span>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}

      {pagoExitoso && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 border-2 border-emerald-400 p-8 rounded-xl max-w-sm w-full text-center shadow-2xl">
            <div className="w-12 h-12 bg-emerald-500 text-black font-black text-2xl flex items-center justify-center rounded-full mx-auto mb-4">
              ✓
            </div>
            <h3 className="text-xl font-black text-emerald-400 uppercase tracking-widest">¡TRANSACCIÓN EXITOSA!</h3>
            <p className="text-zinc-300 text-xs mt-3 leading-relaxed">
              El entorno simulado de <span className="font-bold text-white">Stripe</span> ha procesado el cobro correctamente.
            </p>
            <p className="text-[10px] text-zinc-500 mt-2 bg-zinc-950 p-2 rounded border border-zinc-800">
              STATUS CODE: 200 OK // STRIPE_TRANSACTION_COMPLETE
            </p>
            <button 
              onClick={() => setPagoExitoso(false)}
              className="mt-6 bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-2 px-6 rounded uppercase text-xs tracking-wider"
            >
              Cerrar Consola
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;