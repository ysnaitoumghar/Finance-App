package com.finance.financeapp.dto;

import com.finance.financeapp.entity.BudgetPeriod;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BudgetDTO {
    private Long categoryId;
    private BigDecimal limitAmount;
    private BudgetPeriod period;
    private LocalDate monthYear;
    private Integer alertPercentage;
}
