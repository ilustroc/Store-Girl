# 07. Diagrama de clases

```mermaid
classDiagram
    class TecnoStoreApplication
    class AuthController
    class ProductController
    class OrderController
    class AuthService
    class ProductService
    class OrderService
    class UserRepository
    class ProductRepository
    class OrderRepository
    class User
    class Category
    class Product
    class Order
    class OrderItem

    AuthController --> AuthService
    ProductController --> ProductService
    OrderController --> OrderService
    AuthService --> UserRepository
    ProductService --> ProductRepository
    ProductService --> Category
    OrderService --> OrderRepository
    OrderService --> ProductRepository
    OrderService --> UserRepository
    Product --> Category
    Order --> User
    Order --> OrderItem
    OrderItem --> Product
```
