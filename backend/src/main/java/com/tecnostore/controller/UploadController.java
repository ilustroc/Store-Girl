package com.tecnostore.controller;

import com.tecnostore.model.Role;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/uploads")
public class UploadController {
    private static final long MAX_IMAGE_SIZE = 5L * 1024L * 1024L;
    private static final Set<String> ALLOWED_EXTENSIONS = Set.of("png", "jpg", "jpeg", "webp");

    private final String productImageDir;

    public UploadController(@Value("${app.upload.product-image-dir:../frontend/assets/img}") String productImageDir) {
        this.productImageDir = productImageDir;
    }

    @PostMapping("/product-image")
    public Map<String, String> uploadProductImage(
            @RequestHeader(value = "X-User-Role", required = false) String role,
            @RequestParam("file") MultipartFile file
    ) throws IOException {
        requireAdmin(role);
        validateImage(file);

        Path uploadDirectory = resolveUploadDirectory();
        Files.createDirectories(uploadDirectory);

        String filename = uniqueFilename(uploadDirectory, file.getOriginalFilename());
        Path destination = uploadDirectory.resolve(filename).normalize();
        file.transferTo(destination);

        return Map.of("path", "assets/img/" + filename);
    }

    private void validateImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Selecciona una imagen valida");
        }
        if (file.getSize() > MAX_IMAGE_SIZE) {
            throw new IllegalArgumentException("La imagen no debe superar 5MB");
        }
        String extension = extension(file.getOriginalFilename());
        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new IllegalArgumentException("Formato no permitido. Usa png, jpg, jpeg o webp");
        }
        String contentType = file.getContentType();
        if (contentType == null || !contentType.toLowerCase(Locale.ROOT).startsWith("image/")) {
            throw new IllegalArgumentException("El archivo seleccionado no es una imagen");
        }
    }

    private Path resolveUploadDirectory() {
        Path configured = Paths.get(productImageDir);
        if (configured.isAbsolute()) {
            return configured.normalize();
        }

        Path currentDirectory = Paths.get("").toAbsolutePath();
        Path backendRelative = currentDirectory.resolve(configured).normalize();
        Path rootRelative = currentDirectory.resolve("frontend/assets/img").normalize();
        if (Files.exists(rootRelative.getParent()) && !Files.exists(backendRelative.getParent())) {
            return rootRelative;
        }
        return backendRelative;
    }

    private String uniqueFilename(Path directory, String originalFilename) throws IOException {
        String safeName = sanitize(originalFilename);
        String extension = extension(safeName);
        String baseName = safeName.substring(0, safeName.length() - extension.length() - 1);
        if (baseName.isBlank()) {
            baseName = "producto";
        }

        String filename = baseName + "." + extension;
        int counter = 1;
        while (Files.exists(directory.resolve(filename))) {
            filename = baseName + "-" + counter + "." + extension;
            counter++;
        }
        return filename;
    }

    private String sanitize(String filename) {
        String safeName = filename == null ? "producto.png" : Paths.get(filename).getFileName().toString();
        safeName = safeName.toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9._-]", "-");
        safeName = safeName.replaceAll("-+", "-").replaceAll("^[-.]+|[-.]+$", "");
        return safeName.contains(".") ? safeName : safeName + ".png";
    }

    private String extension(String filename) {
        if (filename == null) {
            return "";
        }
        int dot = filename.lastIndexOf('.');
        return dot >= 0 ? filename.substring(dot + 1).toLowerCase(Locale.ROOT) : "";
    }

    private void requireAdmin(String role) {
        if (!Role.ADMIN.name().equalsIgnoreCase(role)) {
            throw new SecurityException("Solo el administrador puede subir imagenes");
        }
    }
}
