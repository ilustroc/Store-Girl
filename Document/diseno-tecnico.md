# Diseno tecnico de la solucion

## Project Charter basico

| Campo | Detalle |
| --- | --- |
| Proyecto | Tecno Store |
| Objetivo | Crear un prototipo ecommerce con catalogo, carrito, usuarios, administrador y base de datos. |
| Alcance | Frontend Bootstrap, backend Java, BD H2, CRUD de productos, pedidos y usuarios. |
| Usuarios | Cliente y administrador. |
| Entregables | Codigo fuente, scripts SQL, API REST, documentacion tecnica. |
| Restricciones | Proyecto academico, seguridad en modo demo, ejecucion local. |

## BPM: proceso de compra

```mermaid
flowchart LR
    A[Usuario revisa catalogo] --> B[Agrega productos al carrito]
    B --> C{Tiene sesion?}
    C -- No --> D[Login o registro]
    D --> E[Confirma compra]
    C -- Si --> E[Confirma compra]
    E --> F[Backend valida stock]
    F --> G{Stock disponible?}
    G -- No --> H[Mostrar error]
    G -- Si --> I[Registrar pedido]
    I --> J[Descontar stock]
    J --> K[Usuario ve pedido]
```

## DER logico

```mermaid
erDiagram
    USERS ||--o{ SALES_ORDERS : realiza
    SALES_ORDERS ||--|{ ORDER_ITEMS : contiene
    PRODUCTS ||--o{ ORDER_ITEMS : aparece_en

    USERS {
        bigint id PK
        varchar full_name
        varchar email UK
        varchar password
        varchar role
        varchar phone
        timestamp created_at
    }

    PRODUCTS {
        bigint id PK
        varchar name
        varchar description
        varchar category
        decimal price
        int stock
        varchar image_url
        boolean active
    }

    SALES_ORDERS {
        bigint id PK
        varchar order_number UK
        bigint user_id FK
        varchar customer_name
        varchar customer_email
        varchar status
        decimal subtotal
        decimal shipping
        decimal total
    }

    ORDER_ITEMS {
        bigint id PK
        bigint order_id FK
        bigint product_id FK
        varchar product_name
        decimal unit_price
        int quantity
        decimal subtotal
    }
```

## Diagrama de clases UML

```mermaid
classDiagram
    class Application {
        +main(args)
    }
    class ApiServer {
        -ProductRepository productRepository
        -UserRepository userRepository
        -OrderRepository orderRepository
        +start(port)
    }
    class ProductRepository {
        +findAll(includeInactive)
        +findById(id)
        +create(input)
        +update(id, input)
        +softDelete(id)
    }
    class UserRepository {
        +login(email, password)
        +findAll()
        +create(fullName, email, password, phone)
    }
    class OrderRepository {
        +findAll()
        +findByEmail(email)
        +create(userId, items)
        +updateStatus(orderNumber, status)
    }
    class Database {
        +initialize()
        +getConnection()
    }

    Application --> Database
    Application --> ApiServer
    ApiServer --> ProductRepository
    ApiServer --> UserRepository
    ApiServer --> OrderRepository
    ProductRepository --> Database
    UserRepository --> Database
    OrderRepository --> Database
```

## Gantt

```mermaid
gantt
    title Plan de trabajo Tecno Store
    dateFormat  YYYY-MM-DD
    section Analisis
    Requisitos y alcance          :done, a1, 2026-05-01, 2d
    Alternativas de solucion      :done, a2, after a1, 1d
    section Diseno
    DER y esquema fisico          :done, d1, 2026-05-04, 1d
    Prototipo UX/UI Bootstrap     :done, d2, after d1, 1d
    section Implementacion
    Backend Java y API REST       :done, i1, 2026-05-05, 2d
    Frontend y panel admin        :done, i2, after i1, 2d
    section Pruebas
    Pruebas funcionales locales   :active, p1, 2026-05-08, 1d
```
