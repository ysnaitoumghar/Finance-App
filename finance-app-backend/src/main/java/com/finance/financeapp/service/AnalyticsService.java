package com.finance.financeapp.service;

import com.finance.financeapp.dto.*;
import com.finance.financeapp.entity.Expense;
import com.finance.financeapp.entity.Income;
import com.finance.financeapp.entity.Budget;
import com.finance.financeapp.repository.ExpenseRepository;
import com.finance.financeapp.repository.IncomeRepository;
import com.finance.financeapp.repository.BudgetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {
    private final ExpenseRepository expenseRepository;
    private final IncomeRepository incomeRepository;
    private final BudgetRepository budgetRepository;

    public AnalyticsResponse getSummary(Long userId, LocalDate startDate, LocalDate endDate) {
        List<Expense> expenses = expenseRepository.findByUserIdAndExpenseDateBetween(userId, startDate, endDate);
        List<Income> incomes = incomeRepository.findByUserIdAndIncomeDateBetween(userId, startDate, endDate);
        List<Budget> budgets = budgetRepository.findByUserId(userId);

        BigDecimal totalExpenses = expenses.stream()
                .map(Expense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalIncome = incomes.stream()
                .map(Income::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal savings = totalIncome.subtract(totalExpenses);

        BigDecimal totalBudgeted = budgets.stream()
                .map(Budget::getLimitAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal budgetRemaining = totalBudgeted.subtract(totalExpenses);

        return new AnalyticsResponse(totalIncome, totalExpenses, savings, budgetRemaining);
    }

    public List<CategoryAnalytics> getExpensesByCategory(Long userId, LocalDate startDate, LocalDate endDate) {
        List<Expense> expenses = expenseRepository.findByUserIdAndExpenseDateBetween(userId, startDate, endDate);
        
        Map<String, BigDecimal> categoryMap = expenses.stream()
                .collect(Collectors.groupingBy(
                        expense -> expense.getCategory() != null ? expense.getCategory().getName() : "Uncategorized",
                        Collectors.reducing(BigDecimal.ZERO, Expense::getAmount, BigDecimal::add)
                ));

        BigDecimal total = categoryMap.values().stream()
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return categoryMap.entrySet().stream()
                .map(entry -> {
                    Double percentage = total.compareTo(BigDecimal.ZERO) > 0 
                            ? entry.getValue().divide(total, 4, RoundingMode.HALF_UP).multiply(new BigDecimal(100)).doubleValue()
                            : 0.0;
                    return new CategoryAnalytics(entry.getKey(), entry.getValue(), percentage);
                })
                .sorted((a, b) -> b.getAmount().compareTo(a.getAmount()))
                .collect(Collectors.toList());
    }

    public List<TrendAnalytics> getTrend(Long userId, LocalDate startDate, LocalDate endDate) {
        List<TrendAnalytics> trendData = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMMM yyyy");

        LocalDate current = startDate;
        while (!current.isAfter(endDate)) {
            YearMonth yearMonth = YearMonth.from(current);
            LocalDate monthStart = yearMonth.atDay(1);
            LocalDate monthEnd = yearMonth.atEndOfMonth();

            List<Expense> monthExpenses = expenseRepository.findByUserIdAndExpenseDateBetween(
                    userId, monthStart, monthEnd);
            List<Income> monthIncomes = incomeRepository.findByUserIdAndIncomeDateBetween(
                    userId, monthStart, monthEnd);

            BigDecimal monthExpenseTotal = monthExpenses.stream()
                    .map(Expense::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            BigDecimal monthIncomeTotal = monthIncomes.stream()
                    .map(Income::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            trendData.add(new TrendAnalytics(
                    current.format(formatter),
                    monthIncomeTotal,
                    monthExpenseTotal
            ));

            current = current.plusMonths(1);
        }

        return trendData;
    }

    public List<BudgetAnalytics> getBudgetStatus(Long userId, LocalDate startDate, LocalDate endDate) {
        List<Budget> budgets = budgetRepository.findByUserId(userId);
        List<BudgetAnalytics> budgetStatus = new ArrayList<>();

        for (Budget budget : budgets) {
            List<Expense> categoryExpenses = expenseRepository.findByUserIdAndCategoryIdAndExpenseDateBetween(
                    userId, budget.getCategory().getId(), startDate, endDate);

            BigDecimal spent = categoryExpenses.stream()
                    .map(Expense::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            BigDecimal budgeted = budget.getLimitAmount();
            BigDecimal remaining = budgeted.subtract(spent);

            budgetStatus.add(new BudgetAnalytics(
                    budget.getCategory().getName(),
                    budgeted,
                    spent,
                    remaining
            ));
        }

        return budgetStatus.stream()
                .sorted((a, b) -> b.getSpent().compareTo(a.getSpent()))
                .collect(Collectors.toList());
    }
}
