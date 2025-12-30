package com.xiaohongshu.service;

import com.xiaohongshu.entity.Collection;
import com.xiaohongshu.entity.Like;
import com.xiaohongshu.entity.Post;
import com.xiaohongshu.entity.User;
import com.xiaohongshu.repository.CollectionRepository;
import com.xiaohongshu.repository.LikeRepository;
import com.xiaohongshu.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class PostService {
    @Autowired
    private PostRepository postRepository;

    @Autowired
    private LikeRepository likeRepository;

    @Autowired
    private CollectionRepository collectionRepository;

    public Post createPost(Post post) {
        return postRepository.save(post);
    }

    public List<Post> getAllPosts() {
        return postRepository.findAllByOrderByCreatedAtDesc();
    }

    public Post getPostById(Long id) {
        return postRepository.findById(id).orElseThrow(() -> new RuntimeException("Post not found"));
    }

    @Transactional
    public void toggleLike(User user, Long postId) {
        Post post = getPostById(postId);
        Optional<Like> existingLike = likeRepository.findByUserAndPost(user, post);
        if (existingLike.isPresent()) {
            likeRepository.delete(existingLike.get());
        } else {
            Like like = new Like();
            like.setUser(user);
            like.setPost(post);
            likeRepository.save(like);
        }
    }

    @Transactional
    public void toggleCollection(User user, Long postId) {
        Post post = getPostById(postId);
        Optional<Collection> existingCollection = collectionRepository.findByUserAndPost(user, post);
        if (existingCollection.isPresent()) {
            collectionRepository.delete(existingCollection.get());
        } else {
            Collection collection = new Collection();
            collection.setUser(user);
            collection.setPost(post);
            collectionRepository.save(collection);
        }
    }

    public long getLikeCount(Long postId) {
        Post post = getPostById(postId);
        return likeRepository.countByPost(post);
    }

    public boolean isLikedBy(User user, Long postId) {
        Post post = getPostById(postId);
        return likeRepository.existsByUserAndPost(user, post);
    }

    public long getCollectionCount(Long postId) {
        Post post = getPostById(postId);
        return collectionRepository.countByPost(post);
    }

    public boolean isCollectedBy(User user, Long postId) {
        Post post = getPostById(postId);
        return collectionRepository.existsByUserAndPost(user, post);
    }
}
