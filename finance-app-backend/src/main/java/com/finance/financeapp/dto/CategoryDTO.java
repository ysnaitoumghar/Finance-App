package com.finance.financeapp.dto;

import com.finance.financeapp.entity.TransactionType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryDTO {
    private String name;
    private String color;
    private String icon;
    private TransactionType type;
}
