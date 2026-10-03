package com.ksit.find.dto;

import jakarta.validation.constraints.NotBlank;

public class ClaimRequest {
    @NotBlank
    private String evidence;

    public String getEvidence() {
        return evidence;
    }

    public void setEvidence(String evidence) {
        this.evidence = evidence;
    }
}
