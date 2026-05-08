# 06. Base de datos

## Tablas

- `users`: compradores y administradores.
- `categories`: clasificacion del catalogo.
- `products`: productos activos o desactivados.
- `orders`: pedidos por usuario.
- `order_items`: detalle de cada pedido.

## DER

```mermaid
erDiagram
    USERS ||--o{ ORDERS : realiza
    CATEGORIES ||--o{ PRODUCTS : agrupa
    ORDERS ||--|{ ORDER_ITEMS : contiene
    PRODUCTS ||--o{ ORDER_ITEMS : vendido_en

    USERS {
        bigint id PK
        varchar full_name
        varchar email UK
        varchar password
        varchar role
        varchar phone
        boolean active
        timestamp created_at
    }

    CATEGORIES {
        bigint id PK
        varchar name
        varchar description
    }

    PRODUCTS {
        bigint id PK
        varchar name
        varchar description
        bigint category_id FK
        decimal price
        int stock
        varchar image
        boolean active
        timestamp created_at
    }

    ORDERS {
        bigint id PK
        bigint user_id FK
        decimal total
        varchar status
        timestamp created_at
    }

    ORDER_ITEMS {
        bigint id PK
        bigint order_id FK
        bigint product_id FK
        int quantity
        decimal unit_price
        decimal subtotal
    }
```
