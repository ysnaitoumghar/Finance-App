package com.finance.financeapp.controller;

import com.finance.financeapp.dto.BudgetDTO;
import com.finance.financeapp.dto.BudgetStatus;
import com.finance.financeapp.dto.MessageResponse;
import com.finance.financeapp.entity.Budget;
import com.finance.financeapp.service.BudgetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/budgets")
@RequiredArgsConstructor
@CrossOrigin(origins = "${app.cors.allowedOrigins}")
public class BudgetController {
    private final BudgetService budgetService;

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> createBudget(
        @RequestParam Long userId,
        @Valid @RequestBody BudgetDTO budgetDTO
    ) {
        Budget budget = budgetService.createBudget(userId, budgetDTO);
        return ResponseEntity.ok(budget);
    }

    @GetMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getBudgets(@RequestParam Long userId) {
        List<Budget> budgets = budgetService.getBudgetsByUserId(userId);
        return ResponseEntity.ok(budgets);
    }

    @GetMapping("/{budgetId}/status")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getBudgetStatus(@PathVariable Long budgetId) {
        BudgetStatus status = budgetService.getBudgetStatus(budgetId);
        return ResponseEntity.ok(status);
    }

    @PutMapping("/{budgetId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> updateBudget(
        @PathVariable Long budgetId,
        @Valid @RequestBody BudgetDTO budgetDTO
    ) {
        Budget budget = budgetService.updateBudget(budgetId, budgetDTO);
        return ResponseEntity.ok(budget);
    }

    @DeleteMapping("/{budgetId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> deleteBudget(@PathVariable Long budgetId) {
        budgetService.deleteBudget(budgetId);
        return ResponseEntity.ok(new MessageResponse("Budget deleted successfully"));
    }
}
