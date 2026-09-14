package com.bookmind.repository;

import com.bookmind.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByOrderId(Long orderId);
    java.util.Optional<Payment> findByTransactionRef(String transactionRef);
    java.util.Optional<Payment> findByTransactionId(String transactionId);
}
