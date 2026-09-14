package com.bookmind.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "inventory_receipt_details")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventoryReceiptDetail {

    @EmbeddedId
    private InventoryReceiptDetailId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("receiptId")
    @JoinColumn(name = "receipt_id")
    @JsonIgnore
    private InventoryReceipt receipt;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("bookId")
    @JoinColumn(name = "book_id")
    private Book book;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "import_price", precision = 10, scale = 2, nullable = false)
    private BigDecimal importPrice;

    public InventoryReceiptDetailId getId() {
        return id;
    }

    public void setId(InventoryReceiptDetailId id) {
        this.id = id;
    }

    public InventoryReceipt getReceipt() {
        return receipt;
    }

    public void setReceipt(InventoryReceipt receipt) {
        this.receipt = receipt;
    }

    public Book getBook() {
        return book;
    }

    public void setBook(Book book) {
        this.book = book;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getImportPrice() {
        return importPrice;
    }

    public void setImportPrice(BigDecimal importPrice) {
        this.importPrice = importPrice;
    }
}
