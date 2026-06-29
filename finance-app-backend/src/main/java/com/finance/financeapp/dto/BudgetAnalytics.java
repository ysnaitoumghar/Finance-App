package com.finance.financeapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BudgetAnalytics {
    private String category;
    private BigDecimal budgeted;
    private BigDecimal spent;
    private BigDecimal remaining;
}
