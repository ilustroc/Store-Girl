package com.tecnostore.service;

import com.tecnostore.dto.OrderItemRequest;
import com.tecnostore.dto.OrderRequest;
import com.tecnostore.model.Order;
import com.tecnostore.model.OrderItem;
import com.tecnostore.model.OrderStatus;
import com.tecnostore.model.Product;
import com.tecnostore.model.User;
import com.tecnostore.repository.OrderRepository;
import com.tecnostore.repository.ProductRepository;
import com.tecnostore.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class OrderService {
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public OrderService(OrderRepository orderRepository, UserRepository userRepository, ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    @Transactional
    public Order create(OrderRequest request) {
        User user = userRepository.findById(request.userId())
                .filter(User::getActive)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        Order order = new Order();
        order.setUser(user);
        order.setStatus(OrderStatus.CONFIRMED);
        order.setTotal(BigDecimal.ZERO);

        BigDecimal total = BigDecimal.ZERO;
        for (OrderItemRequest itemRequest : request.items()) {
            Product product = productRepository.findById(itemRequest.productId())
                    .filter(Product::getActive)
                    .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado: " + itemRequest.productId()));

            if (product.getStock() < itemRequest.quantity()) {
                throw new IllegalArgumentException("Stock insuficiente para " + product.getName());
            }

            BigDecimal subtotal = product.getPrice().multiply(BigDecimal.valueOf(itemRequest.quantity()));
            product.setStock(product.getStock() - itemRequest.quantity());
            productRepository.save(product);

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(product);
            item.setQuantity(itemRequest.quantity());
            item.setUnitPrice(product.getPrice());
            item.setSubtotal(subtotal);
            order.getItems().add(item);
            total = total.add(subtotal);
        }

        order.setTotal(total);
        return orderRepository.save(order);
    }

    public List<Order> findAll() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Order> findByUser(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
}
