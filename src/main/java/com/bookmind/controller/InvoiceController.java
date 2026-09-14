package com.bookmind.controller;

import com.bookmind.dto.ApiResponse;
import com.bookmind.dto.InvoiceDto;
import com.bookmind.service.InvoiceService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class InvoiceController {

    private final InvoiceService invoiceService;

    public InvoiceController(InvoiceService invoiceService) {
        this.invoiceService = invoiceService;
    }

    @GetMapping("/{id}/invoice")
    public ResponseEntity<ApiResponse<InvoiceDto>> getInvoiceData(@PathVariable("id") Long id) {
        try {
            InvoiceDto invoice = invoiceService.getInvoice(id);
            return ResponseEntity.ok(ApiResponse.success("Lấy thông tin hóa đơn thành công!", invoice));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping(value = "/{id}/invoice/print", produces = MediaType.TEXT_HTML_VALUE + ";charset=UTF-8")
    public ResponseEntity<String> printInvoiceHtml(@PathVariable("id") Long id) {
        try {
            String html = invoiceService.renderInvoiceHtml(id);
            return ResponseEntity.ok(html);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("<h3>Không thể tạo hóa đơn: " + e.getMessage() + "</h3>");
        }
    }
}
