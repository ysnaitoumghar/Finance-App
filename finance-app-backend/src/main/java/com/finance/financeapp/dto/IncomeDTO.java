package com.finance.financeapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class IncomeDTO {
    private Long categoryId;
    private BigDecimal amount;
    private String description;
    private LocalDate incomeDate;
    private String source;
}
