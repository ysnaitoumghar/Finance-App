package com.finance.financeapp.dto;

import com.finance.financeapp.entity.Budget;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BudgetStatus {
    private Budget budget;
    private BigDecimal spent;
    private BigDecimal remaining;
    private Double percentageUsed;
    private Boolean isOverBudget;
}
