# 05. BPM de procesos

## Proceso de compra

El proceso de compra inicia cuando el cliente entra al catalogo, busca o filtra productos, revisa el detalle y agrega items al carrito. Luego revisa cantidades, inicia sesion si es necesario y confirma el checkout.

El backend valida stock antes de registrar el pedido. Si no hay unidades suficientes, devuelve un mensaje claro. Si el stock es suficiente, registra el pedido como `CONFIRMED`, descuenta inventario y el usuario puede verlo en `Mis pedidos`.

Diagrama PlantUML relacionado:

- `plantuml/flujo-compra.puml`

## Proceso administrador

El administrador inicia sesion, entra al panel de control y gestiona productos, categorias e inventario. Para crear un producto puede subir una imagen, recibir la ruta relativa y guardar el producto con esa imagen.

Diagrama PlantUML relacionado:

- `plantuml/flujo-admin-producto.puml`

## Visualizacion de diagramas

Los diagramas estan en `documentacion/plantuml/`. Pueden renderizarse con la extension PlantUML en VS Code, PlantUML online o cualquier visor compatible.
