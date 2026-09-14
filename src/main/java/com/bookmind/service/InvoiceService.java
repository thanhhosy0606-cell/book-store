package com.bookmind.service;

import com.bookmind.dto.InvoiceDto;
import com.bookmind.entity.Order;
import com.bookmind.entity.OrderDetail;
import com.bookmind.entity.Payment;
import com.bookmind.entity.enums.PaymentMethod;
import com.bookmind.repository.OrderRepository;
import com.bookmind.repository.PaymentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.text.NumberFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
public class InvoiceService {

    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;

    public InvoiceService(OrderRepository orderRepository, PaymentRepository paymentRepository) {
        this.orderRepository = orderRepository;
        this.paymentRepository = paymentRepository;
    }

    @Transactional
    public String ensureInvoiceGenerated(Order order) {
        if (order.getInvoiceNumber() == null || order.getInvoiceNumber().isBlank()) {
            String invoiceNum = String.format("HD-%d-%06d", LocalDateTime.now().getYear(), order.getId());
            order.setInvoiceNumber(invoiceNum);
            order.setInvoiceIssuedAt(LocalDateTime.now());
            orderRepository.save(order);
            return invoiceNum;
        }
        return order.getInvoiceNumber();
    }

    @Transactional(readOnly = true)
    public InvoiceDto getInvoice(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn hàng #" + orderId));

        ensureInvoiceGenerated(order);

        List<Payment> payments = paymentRepository.findByOrderId(order.getId());
        Payment primaryPayment = payments.isEmpty() ? null : payments.get(0);

        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("HH:mm:ss dd/MM/yyyy");
        String issueDate = order.getInvoiceIssuedAt() != null
                ? order.getInvoiceIssuedAt().format(dtf)
                : LocalDateTime.now().format(dtf);

        List<InvoiceDto.InvoiceItemDto> itemDtos = new ArrayList<>();
        if (order.getOrderDetails() != null) {
            for (OrderDetail d : order.getOrderDetails()) {
                BigDecimal unitPrice = d.getUnitPrice() != null ? d.getUnitPrice() : BigDecimal.ZERO;
                int qty = (d.getQuantity() != null) ? d.getQuantity().intValue() : 1;
                BigDecimal itemTotal = unitPrice.multiply(BigDecimal.valueOf(qty));
                itemDtos.add(InvoiceDto.InvoiceItemDto.builder()
                        .title(d.getBook() != null ? d.getBook().getTitle() : "Sách")
                        .author(d.getBook() != null ? d.getBook().getAuthor() : "")
                        .quantity(qty)
                        .unitPrice(unitPrice)
                        .totalPrice(itemTotal)
                        .build());
            }
        }

        String txRef = primaryPayment != null && primaryPayment.getTransactionRef() != null
                ? primaryPayment.getTransactionRef()
                : (order.getTrackingNumber() != null ? order.getTrackingNumber() : "");

        String pStatus = primaryPayment != null && primaryPayment.getPaymentStatus() != null
                ? primaryPayment.getPaymentStatus().name()
                : "PENDING";

        boolean isVietQR = primaryPayment != null && primaryPayment.getPaymentMethod() == PaymentMethod.VIETQR;
        String methodDisplay = isVietQR ? "Chuyển khoản VietQR (PayOS)" : "Thanh toán khi nhận hàng (COD)";
        String signatureDisplay = isVietQR
                ? "Xác thực giao dịch tự động qua cổng PayOS VietQR"
                : "Xác nhận đơn hàng giao COD (BookMind Store)";

        return InvoiceDto.builder()
                .invoiceNumber(order.getInvoiceNumber())
                .orderId(order.getId())
                .trackingNumber(order.getTrackingNumber())
                .issueDate(issueDate)
                .sellerName("CÔNG TY CP VĂN HÓA & TRUYỀN THÔNG NHÃ NAM")
                .sellerTaxCode("0101823901")
                .sellerAddress("59 Đỗ Quang, P. Trung Hòa, Q. Cầu Giấy, Hà Nội")
                .sellerPhone("024 3514 6875")
                .sellerEmail("cskh@nhanam.com.vn")
                .customerName(order.getReceiverName())
                .customerPhone(order.getReceiverPhone())
                .customerAddress(order.getShippingAddress())
                .customerEmail(order.getUser() != null ? order.getUser().getEmail() : "")
                .items(itemDtos)
                .subtotal(order.getSubtotal())
                .shippingFee(order.getShippingFee())
                .discountAmount(BigDecimal.ZERO)
                .totalAmount(order.getTotalAmount())
                .paymentMethod(methodDisplay)
                .paymentStatus(pStatus.equals("COMPLETED") ? "ĐÃ THANH TOÁN" : "CHỜ THANH TOÁN")
                .transactionRef(txRef)
                .digitalSignature(signatureDisplay)
                .build();
    }

    public String renderInvoiceHtml(Long orderId) {
        InvoiceDto inv = getInvoice(orderId);
        Locale localeVN = Locale.forLanguageTag("vi-VN");
        NumberFormat currencyVN = NumberFormat.getCurrencyInstance(localeVN);

        StringBuilder itemsHtml = new StringBuilder();
        int idx = 1;
        for (InvoiceDto.InvoiceItemDto item : inv.getItems()) {
            itemsHtml.append(String.format(
                    "<tr>" +
                    "<td class='text-center'>%d</td>" +
                    "<td><strong>%s</strong><br><small class='text-muted'>%s</small></td>" +
                    "<td class='text-center'>%d</td>" +
                    "<td class='text-end'>%s</td>" +
                    "<td class='text-end fw-bold'>%s</td>" +
                    "</tr>",
                    idx++,
                    escapeHtml(item.getTitle()),
                    escapeHtml(item.getAuthor()),
                    item.getQuantity(),
                    currencyVN.format(item.getUnitPrice()),
                    currencyVN.format(item.getTotalPrice())
            ));
        }

        return "<!DOCTYPE html>\n" +
                "<html lang='vi'>\n" +
                "<head>\n" +
                "    <meta charset='UTF-8'>\n" +
                "    <title>Hóa Đơn Điện Tử - " + inv.getInvoiceNumber() + "</title>\n" +
                "    <link href='https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css' rel='stylesheet'>\n" +
                "    <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'>\n" +
                "    <style>\n" +
                "        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; color: #1e293b; padding: 2rem 0; }\n" +
                "        .invoice-card { max-width: 800px; margin: 0 auto; background: #fff; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.06); padding: 2.5rem; border: 1px solid #e2e8f0; position: relative; }\n" +
                "        .invoice-header { border-bottom: 2px solid #00482b; padding-bottom: 1.5rem; margin-bottom: 2rem; }\n" +
                "        .brand-title { color: #00482b; font-weight: 800; font-size: 1.5rem; letter-spacing: 0.5px; }\n" +
                "        .stamp-box { border: 2px solid #10b981; color: #10b981; font-weight: 800; font-size: 0.9rem; padding: 0.4rem 1rem; border-radius: 8px; display: inline-block; transform: rotate(-5deg); text-transform: uppercase; letter-spacing: 1px; }\n" +
                "        .table-invoice th { background-color: #f1f5f9; color: #475569; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.5px; }\n" +
                "        @media print {\n" +
                "            body { background: #fff; padding: 0; }\n" +
                "            .invoice-card { box-shadow: none; border: none; padding: 1.5rem; max-width: 100%; }\n" +
                "            .no-print { display: none !important; }\n" +
                "        }\n" +
                "    </style>\n" +
                "</head>\n" +
                "<body>\n" +
                "    <div class='container'>\n" +
                "        <div class='text-center mb-3 no-print'>\n" +
                "            <button onclick='window.print()' class='btn btn-primary rounded-pill px-4 me-2'><i class='fas fa-print me-2'></i>In / Tải PDF</button>\n" +
                "            <button onclick='window.close()' class='btn btn-outline-secondary rounded-pill px-3'>Đóng</button>\n" +
                "        </div>\n" +
                "        <div class='invoice-card'>\n" +
                "            <div class='invoice-header d-flex justify-content-between align-items-start'>\n" +
                "                <div>\n" +
                "                    <div class='brand-title'><i class='fas fa-book-open me-2'></i>NHÃ NAM BOOK STORE</div>\n" +
                "                    <div class='text-muted fs-7 mt-1'>" + inv.getSellerName() + "</div>\n" +
                "                    <div class='text-muted fs-8'>MST: " + inv.getSellerTaxCode() + " &bull; Hotline: " + inv.getSellerPhone() + "</div>\n" +
                "                    <div class='text-muted fs-8'>" + inv.getSellerAddress() + "</div>\n" +
                "                </div>\n" +
                "                <div class='text-end'>\n" +
                "                    <h4 class='fw-bold text-dark mb-1'>HÓA ĐƠN ĐIỆN TỬ</h4>\n" +
                "                    <div class='text-primary fw-bold fs-6'>" + inv.getInvoiceNumber() + "</div>\n" +
                "                    <div class='text-muted fs-8 mt-1'>Ngày phát hành: " + inv.getIssueDate() + "</div>\n" +
                "                    <div class='mt-2'><span class='stamp-box'><i class='fas fa-check-circle me-1'></i>" + inv.getPaymentStatus() + "</span></div>\n" +
                "                </div>\n" +
                "            </div>\n" +
                "            <div class='row mb-4'>\n" +
                "                <div class='col-sm-6'>\n" +
                "                    <h6 class='fw-bold text-secondary text-uppercase fs-8'>Khách hàng (Người nhận)</h6>\n" +
                "                    <div class='fw-bold text-dark fs-6'>" + escapeHtml(inv.getCustomerName()) + "</div>\n" +
                "                    <div class='text-muted fs-7'>SĐT: " + escapeHtml(inv.getCustomerPhone()) + "</div>\n" +
                "                    <div class='text-muted fs-7'>Địa chỉ: " + escapeHtml(inv.getCustomerAddress()) + "</div>\n" +
                "                </div>\n" +
                "                <div class='col-sm-6 text-sm-end'>\n" +
                "                    <h6 class='fw-bold text-secondary text-uppercase fs-8'>Thông tin giao dịch</h6>\n" +
                "                    <div>Mã vận đơn: <strong class='text-dark'>" + inv.getTrackingNumber() + "</strong></div>\n" +
                "                    <div>Hình thức: <span class='badge bg-light text-dark border'>" + inv.getPaymentMethod() + "</span></div>\n" +
                "                    <div>Mã bút toán: <span class='font-monospace text-muted fs-8'>" + inv.getTransactionRef() + "</span></div>\n" +
                "                </div>\n" +
                "            </div>\n" +
                "            <table class='table table-bordered table-invoice mb-3'>\n" +
                "                <thead>\n" +
                "                    <tr>\n" +
                "                        <th style='width: 50px;' class='text-center'>STT</th>\n" +
                "                        <th>Tên Sách / Tác Phẩm</th>\n" +
                "                        <th style='width: 80px;' class='text-center'>SL</th>\n" +
                "                        <th style='width: 140px;' class='text-end'>Đơn Giá</th>\n" +
                "                        <th style='width: 150px;' class='text-end'>Thành Tiền</th>\n" +
                "                    </tr>\n" +
                "                </thead>\n" +
                "                <tbody>\n" +
                itemsHtml.toString() +
                "                </tbody>\n" +
                "            </table>\n" +
                "            <div class='row justify-content-end'>\n" +
                "                <div class='col-md-6 col-lg-5'>\n" +
                "                    <div class='d-flex justify-content-between mb-1 fs-7 text-muted'><span>Tiền sách:</span><span>" + currencyVN.format(inv.getSubtotal()) + "</span></div>\n" +
                "                    <div class='d-flex justify-content-between mb-1 fs-7 text-muted'><span>Phí vận chuyển:</span><span>" + currencyVN.format(inv.getShippingFee()) + "</span></div>\n" +
                "                    <hr class='my-2'>\n" +
                "                    <div class='d-flex justify-content-between fs-5 fw-bold text-primary'><span>Tổng cộng:</span><span>" + currencyVN.format(inv.getTotalAmount()) + "</span></div>\n" +
                "                </div>\n" +
                "            </div>\n" +
                "            <div class='border-top pt-3 mt-4 text-center text-muted fs-8'>\n" +
                "                <p class='mb-1'><i class='fas fa-shield-alt text-success me-1'></i>" + inv.getDigitalSignature() + "</p>\n" +
                "                <p class='mb-0'>Cảm ơn bạn đã lựa chọn Nhã Nam Book Store! Mọi thắc mắc xin liên hệ 1900 6868 hoặc cskh@nhanam.com.vn</p>\n" +
                "            </div>\n" +
                "        </div>\n" +
                "    </div>\n" +
                "</body>\n" +
                "</html>";
    }

    private String escapeHtml(String input) {
        if (input == null) return "";
        return input.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }
}
