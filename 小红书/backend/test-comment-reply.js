// Test script to verify comment reply functionality
const fs = require('fs');
const path = require('path');

// Path to the database file
const DB_PATH = path.join(__dirname, 'database.json');

// Load current database
const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

console.log('Current comments:', db.comments);

// Simulate creating a comment with parent_id
const newReply = {
  id: db.commentIdCounter++,
  post_id: 1,
  user_id: 1,
  content: 'This is a test reply comment',
  created_at: new Date().toISOString(),
  parent_id: 1  // Reply to comment with id 1
};

// Add the reply to comments array
db.comments.push(newReply);

// Save the updated database
fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));

console.log('Added test reply:', newReply);
console.log('Updated comments:', db.comments);

// Test the getCommentsByPostId function
const { database } = require('./src/database');
const comments = database.getCommentsByPostId(1);
console.log('Comments tree structure:', JSON.stringify(comments, null, 2));
