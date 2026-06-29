package com.finance.financeapp.controller;

import com.finance.financeapp.dto.AnalyticsResponse;
import com.finance.financeapp.dto.CategoryAnalytics;
import com.finance.financeapp.dto.BudgetAnalytics;
import com.finance.financeapp.dto.TrendAnalytics;
import com.finance.financeapp.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/analytics")
@RequiredArgsConstructor
@CrossOrigin(origins = "${app.cors.allowedOrigins}")
public class AnalyticsController {
    private final AnalyticsService analyticsService;

    @PostMapping("/summary")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getSummary(
            @RequestParam Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        AnalyticsResponse summary = analyticsService.getSummary(userId, startDate, endDate);
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/by-category")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getByCategory(
            @RequestParam Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<CategoryAnalytics> categoryData = analyticsService.getExpensesByCategory(userId, startDate, endDate);
        return ResponseEntity.ok(categoryData);
    }

    @GetMapping("/trend")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getTrend(
            @RequestParam Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<TrendAnalytics> trendData = analyticsService.getTrend(userId, startDate, endDate);
        return ResponseEntity.ok(trendData);
    }

    @GetMapping("/budget-status")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getBudgetStatus(
            @RequestParam Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<BudgetAnalytics> budgetStatus = analyticsService.getBudgetStatus(userId, startDate, endDate);
        return ResponseEntity.ok(budgetStatus);
    }
}
