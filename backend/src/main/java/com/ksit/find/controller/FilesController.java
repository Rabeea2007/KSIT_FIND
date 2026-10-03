package com.ksit.find.controller;

import com.ksit.find.dto.ImageUploadResponse;
import com.ksit.find.exception.ResourceNotFoundException;
import com.ksit.find.service.StorageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Locale;

@RestController
public class FilesController {
    private final Path rootDir;
    private final StorageService storageService;

    public FilesController(@Value("${app.storage.root-dir:./uploads}") String rootDir, StorageService storageService) {
        this.rootDir = Paths.get(rootDir).toAbsolutePath().normalize();
        this.storageService = storageService;
    }

    @PostMapping(value = "/api/files", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ImageUploadResponse> uploadImage(@RequestPart("file") MultipartFile file) throws IOException {
        if (file.isEmpty() || file.getSize() > 10 * 1024 * 1024) {
            throw new IllegalArgumentException("Choose an image smaller than 10 MB");
        }
        String contentType = file.getContentType();
        if (contentType == null || !contentType.toLowerCase(Locale.ROOT).matches("image/(jpeg|png|webp|gif)")) {
            throw new IllegalArgumentException("Only JPEG, PNG, WebP, or GIF images are supported");
        }
        return ResponseEntity.ok(new ImageUploadResponse(storageService.store(file)));
    }

    @GetMapping("/files/{filename:.+}")
    public ResponseEntity<Resource> serveFile(@PathVariable String filename) throws IOException {
        Path file = rootDir.resolve(filename).normalize();
        if (!file.startsWith(rootDir) || !Files.isRegularFile(file)) {
            throw new ResourceNotFoundException("File not found");
        }
        Resource resource = new FileSystemResource(file);
        String detectedType = Files.probeContentType(file);
        MediaType contentType = detectedType == null
            ? MediaType.APPLICATION_OCTET_STREAM
            : MediaType.parseMediaType(detectedType);
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
            .contentType(contentType)
            .body(resource);
    }
}
