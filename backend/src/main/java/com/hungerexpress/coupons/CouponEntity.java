package com.hungerexpress.coupons;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "coupon")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CouponEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 40)
    private String code;

    private String description;

    // Either percentOff or amountOff can be set
    private Integer percentOff; // e.g. 10 means 10%

    @Column(precision = 10, scale = 2)
    private BigDecimal amountOff; // fixed amount

    @Column(precision = 10, scale = 2)
    private BigDecimal minAmount; // minimum cart amount to apply

    private Instant expiresAt;

    @Builder.Default
    private Boolean active = true;
}
