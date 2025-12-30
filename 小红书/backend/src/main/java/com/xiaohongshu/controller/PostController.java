package com.xiaohongshu.controller;

import com.xiaohongshu.entity.Post;
import com.xiaohongshu.entity.User;
import com.xiaohongshu.service.PostService;
import com.xiaohongshu.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/posts")
public class PostController {
    @Autowired
    private PostService postService;

    @Autowired
    private UserService userService;

    // Directory to save uploaded files
    // Directory to save uploaded files (External)
    private final Path fileStorageLocation = Paths.get("C:/Users/panjiawei/.gemini/antigravity/xiaohongshu_uploads/")
            .toAbsolutePath()
            .normalize();

    @GetMapping
    public List<Post> getAllPosts() {
        return postService.getAllPosts();
    }

    @PostMapping
    public ResponseEntity<?> createPost(@RequestBody Map<String, Object> postData) {
        try {
            Post post = new Post();
            post.setTitle((String) postData.get("title"));
            post.setDescription((String) postData.get("description"));
            post.setType((String) postData.get("type"));
            post.setUrl((String) postData.get("url"));
            post.setCoverUrl((String) postData.get("cover_url"));

            // Should get user from session/token in a real app
            Long authorId = ((Number) postData.get("author_id")).longValue();
            User author = userService.getUserById(authorId);
            post.setAuthor(author);

            return ResponseEntity.ok(postService.createPost(post));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", "Failed to create post"));
        }
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            // Create directory if not exists
            Files.createDirectories(fileStorageLocation);

            // Generate unique filename
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path targetLocation = fileStorageLocation.resolve(fileName);

            // Save file
            Files.copy(file.getInputStream(), targetLocation);

            // Return URL
            String fileUrl = "http://localhost:8080/api/uploads/" + fileName;
            return ResponseEntity.ok(Map.of("url", fileUrl));

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("message", "Failed to upload file"));
        }
    }

    @GetMapping("/{id}/like/status")
    public ResponseEntity<?> getLikeStatus(@PathVariable Long id, @RequestParam Long userId) {
        User user = userService.getUserById(userId);
        boolean liked = postService.isLikedBy(user, id);
        long count = postService.getLikeCount(id);
        return ResponseEntity.ok(Map.of("liked", liked, "likeCount", count));
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<?> toggleLike(@PathVariable Long id, @RequestBody Map<String, Long> body) {
        Long userId = body.get("userId");
        User user = userService.getUserById(userId);
        postService.toggleLike(user, id);

        // Return new status
        boolean liked = postService.isLikedBy(user, id);
        long count = postService.getLikeCount(id);
        return ResponseEntity.ok(Map.of("liked", liked, "likeCount", count));
    }

    @GetMapping("/{id}/collect/status")
    public ResponseEntity<?> getCollectStatus(@PathVariable Long id, @RequestParam Long userId) {
        User user = userService.getUserById(userId);
        boolean collected = postService.isCollectedBy(user, id);
        long count = postService.getCollectionCount(id);
        return ResponseEntity.ok(Map.of("collected", collected, "collectionCount", count));
    }

    @PostMapping("/{id}/collect")
    public ResponseEntity<?> toggleCollect(@PathVariable Long id, @RequestBody Map<String, Long> body) {
        Long userId = body.get("userId");
        User user = userService.getUserById(userId);
        postService.toggleCollection(user, id);

        // Return new status
        boolean collected = postService.isCollectedBy(user, id);
        long count = postService.getCollectionCount(id);
        return ResponseEntity.ok(Map.of("collected", collected, "collectionCount", count));
    }
}
