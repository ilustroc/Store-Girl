# 11. Indicadores de gestión

El panel administrador `#/admin` presenta ocho indicadores de gestión para evaluar inventario, ventas, rentabilidad, conversión, abandono de carrito, rendimiento y confiabilidad del proceso de compra.

Los indicadores se exponen desde `GET /api/admin/indicators` y requieren rol administrador mediante `X-User-Role: ADMIN`.

## 1. Índice de Rotación de Inventario por Categoría

- Descripción: identifica categorías con mayor movimiento comercial.
- Fórmula: `Rotación = Productos vendidos / Stock promedio`.
- Frecuencia: semanal.
- Meta: identificar el 20% de productos que generan el 80% del movimiento.
- Datos utilizados: `categories`, `products`, `orders`, `order_items`.
- Gestión de errores: si no hay ventas o stock suficiente, muestra mensaje de datos insuficientes.
- Endpoint: `GET /api/admin/indicators`.

## 2. Densidad de Ventas Diarias

- Descripción: mide el ingreso generado por día.
- Fórmula: `Ingreso diario = SUM(Precio de venta x Cantidad vendida por día)`.
- Frecuencia: diaria.
- Meta: identificar días con mayor flujo de caja.
- Datos utilizados: `orders.created_at`, `orders.total`, `orders.status`.
- Gestión de errores: si no existen pedidos confirmados, muestra datos insuficientes.
- Endpoint: `GET /api/admin/indicators`.

## 3. Ranking de Rentabilidad por Producto

- Descripción: identifica productos con mayor margen de ganancia.
- Fórmula: `Margen = (Precio venta - Precio costo) x Unidades vendidas`.
- Frecuencia: mensual.
- Meta: mantener stock mínimo en productos con mayor rentabilidad.
- Datos utilizados: `products.price`, `products.cost_price`, `order_items.quantity`, `orders.status`.
- Gestión de errores: si `cost_price` es cero, el panel marca el costo como no registrado sin romper el cálculo.
- Endpoint: `GET /api/admin/indicators`.

## 4. Tasa de Efectividad de Stock Mínimo

- Descripción: valida la eficiencia de las alertas de reabastecimiento.
- Fórmula: `Efectividad = Alertas atendidas / Productos en stock cero x 100`.
- Frecuencia: quincenal.
- Meta: garantizar continuidad operativa.
- Datos utilizados: `products`, `stock_alerts`.
- Gestión de errores: si no hay productos agotados, muestra que no hay datos suficientes para el cálculo completo y mantiene visibles stock bajo, agotados y alertas pendientes.
- Endpoint: `GET /api/admin/indicators`.

## 5. Tasa de Conversión de Ventas

- Descripción: mide la capacidad de convertir visitantes en compradores.
- Fórmula: `Conversión = Compras realizadas / Visitantes x 100`.
- Frecuencia: mensual.
- Meta: alcanzar una tasa mínima de 3.5%.
- Datos utilizados: `site_visits`, `orders`.
- Gestión de errores: si no hay visitas registradas, muestra datos insuficientes.
- Endpoint relacionado: `POST /api/analytics/visit`.

## 6. Tasa de Abandono del Carrito

- Descripción: mide cuántos usuarios abandonan el proceso antes de comprar.
- Fórmula: `Abandono = Carritos no finalizados / Total de carritos x 100`.
- Frecuencia: semanal.
- Meta: reducir fricciones en el checkout.
- Datos utilizados: `carts`.
- Gestión de errores: si no hay carritos registrados, muestra datos insuficientes.
- Endpoint relacionado: `POST /api/analytics/cart`.

## 7. Tiempo Promedio de Carga del Catálogo

- Descripción: mide el rendimiento de carga del catálogo.
- Fórmula: `Tiempo promedio = Suma de tiempos / Número de mediciones`.
- Frecuencia: diaria.
- Meta: mantener la carga por debajo de 3 segundos.
- Datos utilizados: `performance_logs`.
- Gestión de errores: si no hay mediciones, muestra datos insuficientes.
- Endpoint relacionado: `POST /api/analytics/performance`.

## 8. Porcentaje de Pedidos Confirmados Correctamente

- Descripción: mide la confiabilidad del proceso de compra.
- Fórmula: `Pedidos confirmados = Confirmados / Total de pedidos x 100`.
- Frecuencia: diaria.
- Meta: lograr al menos 98% de pedidos confirmados.
- Datos utilizados: `orders.status`.
- Gestión de errores: si no hay pedidos, muestra datos insuficientes.
- Endpoint: `GET /api/admin/indicators`.

## Diagrama PlantUML

El flujo del dashboard está documentado en:

- `plantuml/dashboard-indicadores.puml`

Puede renderizarse con la extensión PlantUML en VS Code, PlantUML online o cualquier visor compatible.
