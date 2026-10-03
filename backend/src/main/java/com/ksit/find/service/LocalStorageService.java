package com.ksit.find.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class LocalStorageService implements StorageService {
    private final Path rootDir;

    public LocalStorageService(@Value("${app.storage.root-dir:./uploads}") String rootDir) throws IOException {
        this.rootDir = Paths.get(rootDir).toAbsolutePath().normalize();
        Files.createDirectories(this.rootDir);
    }

    @Override
    public String store(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            return null;
        }
        String suppliedName = file.getOriginalFilename() == null ? "upload" : file.getOriginalFilename().replace('\\', '/');
        String originalName = suppliedName.substring(suppliedName.lastIndexOf('/') + 1);
        String safeName = originalName.replaceAll("[^A-Za-z0-9._-]", "_");
        String fileName = UUID.randomUUID() + "-" + safeName;
        Path target = rootDir.resolve(fileName).normalize();
        if (!target.startsWith(rootDir)) {
            throw new IOException("Invalid upload filename");
        }
        Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
        return "/files/" + fileName;
    }

    @Override
    public void delete(String storageKey) throws IOException {
        if (storageKey == null) {
            return;
        }
        Path target = rootDir.resolve(storageKey.replace("/files/", ""));
        Files.deleteIfExists(target);
    }
}
