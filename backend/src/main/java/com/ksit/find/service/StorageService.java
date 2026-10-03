package com.ksit.find.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface StorageService {
    String store(MultipartFile file) throws IOException;
    void delete(String storageKey) throws IOException;
}
