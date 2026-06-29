package com.finance.financeapp.controller;

import com.finance.financeapp.dto.IncomeDTO;
import com.finance.financeapp.dto.MessageResponse;
import com.finance.financeapp.entity.Income;
import com.finance.financeapp.service.IncomeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/income")
@RequiredArgsConstructor
@CrossOrigin(origins = "${app.cors.allowedOrigins}")
public class IncomeController {
    private final IncomeService incomeService;

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> addIncome(
        @RequestParam Long userId,
        @Valid @RequestBody IncomeDTO incomeDTO
    ) {
        Income income = incomeService.addIncome(userId, incomeDTO);
        return ResponseEntity.ok(income);
    }

    @GetMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getIncomes(
        @RequestParam Long userId,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        LocalDate start = startDate != null ? startDate : LocalDate.now().minusMonths(1);
        LocalDate end = endDate != null ? endDate : LocalDate.now();

        List<Income> incomes = incomeService.getIncomesByDateRange(userId, start, end);
        return ResponseEntity.ok(incomes);
    }

    @PutMapping("/{incomeId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> updateIncome(
        @PathVariable Long incomeId,
        @Valid @RequestBody IncomeDTO incomeDTO
    ) {
        Income income = incomeService.updateIncome(incomeId, incomeDTO);
        return ResponseEntity.ok(income);
    }

    @DeleteMapping("/{incomeId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> deleteIncome(@PathVariable Long incomeId) {
        incomeService.deleteIncome(incomeId);
        return ResponseEntity.ok(new MessageResponse("Income deleted successfully"));
    }
}
