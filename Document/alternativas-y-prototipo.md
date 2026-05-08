# Alternativas y prototipo

## Alternativa 1: Spring Boot + MySQL

Aplicacion web con frontend Bootstrap, API REST en Java con Spring Boot, JPA/Hibernate y MySQL. Es una opcion fuerte para produccion porque tiene seguridad, validaciones y persistencia empresarial. Mas del 50% del desarrollo funcional estaria en Java: controladores, servicios, entidades, repositorios, seguridad y reglas de negocio.

## Alternativa 2: Java 17 + H2 embebido

Aplicacion web con frontend Bootstrap y backend Java puro usando `HttpServer`, JDBC y base H2 embebida. Es la alternativa implementada porque no requiere instalar Maven, Gradle ni un motor de BD externo. Mas del 50% del sistema esta en Java: API REST, validaciones, repositorios, operaciones de pedidos y conexion a base de datos.

## Alternativa 3: Jakarta EE + PostgreSQL

Aplicacion empresarial con Jakarta EE, JAX-RS para servicios REST, CDI para componentes, JDBC/JPA y PostgreSQL. Es adecuada si el curso pide arquitectura corporativa y despliegue en servidor de aplicaciones. Mas del 50% se desarrolla en Java mediante recursos REST, servicios, modelos y persistencia.

## Alternativa seleccionada

Se selecciona la Alternativa 2 para el prototipo funcional porque:

- Corre con Java 17 instalado en la maquina.
- Usa una base de datos real en archivo local.
- Permite CRUD de productos desde el panel administrador.
- Mantiene el frontend simple con Bootstrap.
- Es facil de exponer en una presentacion academica.

## Prototipo UX/UI

Pantallas implementadas:

- Catalogo de productos con busqueda y filtro.
- Login y registro.
- Carrito lateral.
- Mis pedidos para usuario.
- Panel administrador.
- Modal `+ Agregar producto`.
- Gestion de estado de pedidos.
