# 03. Alternativas de solucion

## Alternativa 1: Spring Boot + H2

Frontend Bootstrap, API REST con Spring Boot, Spring Data JPA y H2 en memoria. Permite ejecutar localmente sin instalar un motor externo de base de datos. Mas del 50% de la solucion se desarrolla en Java mediante controladores, servicios, entidades, repositorios y reglas de negocio.

## Alternativa 2: Spring Boot + MySQL

Misma arquitectura que la alternativa 1, pero con MySQL como motor persistente. Es mas cercana a un ambiente productivo, aunque requiere instalacion y configuracion adicional.

## Alternativa 3: Jakarta EE + PostgreSQL

Aplicacion empresarial con Jakarta EE, JAX-RS, JPA y PostgreSQL. Es robusta para entornos corporativos, pero agrega complejidad innecesaria para el prototipo universitario.

## Alternativa seleccionada

Se selecciona Spring Boot + H2 porque permite cumplir el requisito de Java, tener arquitectura profesional y ejecutar la demo de forma simple.
