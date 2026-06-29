package com.finance.financeapp.controller;

import com.finance.financeapp.dto.MessageResponse;
import com.finance.financeapp.dto.SharedExpenseDTO;
import com.finance.financeapp.entity.SharedExpense;
import com.finance.financeapp.service.SharedExpenseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/shared-expenses")
@RequiredArgsConstructor
@CrossOrigin(origins = "${app.cors.allowedOrigins}")
public class SharedExpenseController {
    private final SharedExpenseService sharedExpenseService;

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> createSharedExpense(
        @RequestParam Long groupId,
        @Valid @RequestBody SharedExpenseDTO dto
    ) {
        SharedExpense expense = sharedExpenseService.createSharedExpense(groupId, dto);
        return ResponseEntity.ok(expense);
    }

    @GetMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getSharedExpenses(@RequestParam Long groupId) {
        List<SharedExpense> expenses = sharedExpenseService.getSharedExpensesByGroupId(groupId);
        return ResponseEntity.ok(expenses);
    }

    @PostMapping("/splits/{splitId}/settle")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> settleExpense(@PathVariable Long splitId) {
        sharedExpenseService.settleExpense(splitId);
        return ResponseEntity.ok(new MessageResponse("Expense settled successfully"));
    }

    @GetMapping("/owed")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getAmountOwed(
        @RequestParam Long userId,
        @RequestParam Long groupId
    ) {
        BigDecimal amount = sharedExpenseService.getAmountOwed(userId, groupId);
        return ResponseEntity.ok(amount);
    }
}
