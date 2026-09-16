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

    @GetMapping("/{identifier}/invoice")
    public ResponseEntity<ApiResponse<InvoiceDto>> getInvoiceData(@PathVariable("identifier") String identifier) {
        try {
            InvoiceDto invoice = invoiceService.getInvoice(identifier);
            return ResponseEntity.ok(ApiResponse.success("Lấy thông tin hóa đơn thành công!", invoice));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping(value = "/{identifier}/invoice/print", produces = MediaType.TEXT_HTML_VALUE + ";charset=UTF-8")
    public ResponseEntity<String> printInvoiceHtml(@PathVariable("identifier") String identifier) {
        try {
            String html = invoiceService.renderInvoiceHtml(identifier);
            return ResponseEntity.ok(html);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("<h3>Không thể tạo hóa đơn: " + e.getMessage() + "</h3>");
        }
    }
}
