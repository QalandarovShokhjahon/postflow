let posts = [];
let selectedIndex = null;

// Load posts from LocalStorage
function loadPosts() {
  const savedPosts = localStorage.getItem('posts');
  if (savedPosts) {
    posts = JSON.parse(savedPosts);
    if (posts.length > 0) selectPost(0);
  } else {
    addPost();
  }
  renderPosts();
}

// Save posts to LocalStorage
function saveToLocalStorage() {
  localStorage.setItem('posts', JSON.stringify(posts));
}

// Render posts list
function renderPosts(filteredPosts = null) {
  const list = filteredPosts || posts;
  const postList = document.getElementById('postList');
  postList.innerHTML = '';
  list.forEach((post, index) => {
    const div = document.createElement('div');
    div.className = 'p-2 border rounded cursor-pointer hover:bg-gray-100';
    div.innerHTML = `<strong>${post.title || 'No title'}</strong><br><span class="text-sm text-gray-500">${post.platform} | ${post.status}</span>`;
    div.onclick = () => selectPost(posts.indexOf(post));
    postList.appendChild(div);
  });
}

// Select post
function selectPost(index) {
  selectedIndex = index;
  const post = posts[index];
  document.getElementById('title').value = post.title;
  document.getElementById('content').value = post.content;
  document.getElementById('hashtags').value = post.hashtags;
  document.getElementById('platform').value = post.platform;
  document.getElementById('date').value = post.date;
  document.getElementById('time').value = post.time;
  document.getElementById('status').value = post.status;
  renderPreview(post);
}

// Add new post
function addPost() {
  const newPost = { title: '', content: '', hashtags: '', platform: 'Telegram', date: '', time: '', status: 'Draft' };
  posts.push(newPost);
  renderPosts();
  selectPost(posts.length - 1);
  saveToLocalStorage();
}

// Save post
function savePost() {
  if (selectedIndex === null) return;
  const post = posts[selectedIndex];
  post.title = document.getElementById('title').value;
  post.content = document.getElementById('content').value;
  post.hashtags = document.getElementById('hashtags').value;
  post.platform = document.getElementById('platform').value;
  post.date = document.getElementById('date').value;
  post.time = document.getElementById('time').value;
  post.status = document.getElementById('status').value;
  renderPosts();
  renderPreview(post);
  saveToLocalStorage();
}

// Render preview
function renderPreview(post) {
  const preview = document.getElementById('previewContent');
  preview.innerHTML = `<strong>${post.title}</strong><br>${post.content}<br>${post.hashtags}<br><em>${post.platform} | ${post.date} ${post.time} | ${post.status}</em>`;
}

// Visitor counter (CountAPI)
function updateVisitorCount() {
  fetch('https://api.countapi.xyz/hit/postflow-mvp/visitors')
    .then(res => res.json())
    .then(data => {
      document.getElementById('visitorCount').innerText = `Visitors: ${data.value}`;
    }).catch(err => console.error(err));
}

// Mock AI suggestion
function suggestAI() {
  const content = document.getElementById('content').value;
  if (!content) {
    alert('Matn kiriting!');
    return;
  }
  // Simple mock suggestions
  document.getElementById('title').value = content.split(' ').slice(0,3).join(' ') + '...';
  document.getElementById('hashtags').value = '#post #content';
}

// Copy post to clipboard
function copyPost() {
  if (selectedIndex === null) return;
  const post = posts[selectedIndex];
  const text = `${post.title}\n${post.content}\n${post.hashtags}`;
  navigator.clipboard.writeText(text).then(() => {
    alert('Post copied to clipboard!');
  });
}

// Apply filter
function applyFilter() {
  const filterDate = document.getElementById('filterDate').value;
  const filterStatus = document.getElementById('filterStatus').value;
  let filtered = posts;
  if (filterDate) filtered = filtered.filter(p => p.date === filterDate);
  if (filterStatus) filtered = filtered.filter(p => p.status === filterStatus);
  renderPosts(filtered);
}

// Initialize
window.onload = function() {
  loadPosts();
  updateVisitorCount();
};
