package com.finance.financeapp.controller;

import com.finance.financeapp.dto.AnalyticsResponse;
import com.finance.financeapp.dto.ExpenseDTO;
import com.finance.financeapp.dto.MessageResponse;
import com.finance.financeapp.entity.Expense;
import com.finance.financeapp.service.ExpenseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/expenses")
@RequiredArgsConstructor
@CrossOrigin(origins = "${app.cors.allowedOrigins}")
public class ExpenseController {
    private final ExpenseService expenseService;

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> addExpense(
        @RequestParam Long userId,
        @Valid @RequestBody ExpenseDTO expenseDTO
    ) {
        Expense expense = expenseService.addExpense(userId, expenseDTO);
        return ResponseEntity.ok(expense);
    }

    @GetMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getExpenses(
        @RequestParam Long userId,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        LocalDate start = startDate != null ? startDate : LocalDate.now().minusMonths(1);
        LocalDate end = endDate != null ? endDate : LocalDate.now();

        List<Expense> expenses = expenseService.getExpensesByDateRange(userId, start, end);
        return ResponseEntity.ok(expenses);
    }

    @GetMapping("/analytics")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getExpenseAnalytics(
        @RequestParam Long userId,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        LocalDate start = startDate != null ? startDate : LocalDate.now().minusMonths(1);
        LocalDate end = endDate != null ? endDate : LocalDate.now();

        BigDecimal total = expenseService.getTotalExpense(userId, start, end);
        Map<String, BigDecimal> byCategory = expenseService.getExpensesByCategory(userId, start, end);

        Map<String, Object> response = new HashMap<>();
        response.put("totalExpense", total);
        response.put("byCategory", byCategory);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{expenseId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> updateExpense(
        @PathVariable Long expenseId,
        @Valid @RequestBody ExpenseDTO expenseDTO
    ) {
        Expense expense = expenseService.updateExpense(expenseId, expenseDTO);
        return ResponseEntity.ok(expense);
    }

    @DeleteMapping("/{expenseId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> deleteExpense(@PathVariable Long expenseId) {
        expenseService.deleteExpense(expenseId);
        return ResponseEntity.ok(new MessageResponse("Expense deleted successfully"));
    }
}
