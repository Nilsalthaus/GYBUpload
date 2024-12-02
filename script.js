// public/script.js

document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    });
    const result = await response.json();
    alert(result.message);
    if (response.ok) {
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('uploadForm').style.display = 'block';
        document.getElementById('viewFilesButton').style.display = 'block';
    }
});

document.getElementById('uploadForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('teacher', document.getElementById('teacher').value);
    formData.append('subject', document.getElementById('subject').value);
    formData.append('topic', document.getElementById('topic').value);
    formData.append('file', document.getElementById('file').files[0]);
    
    const response = await fetch('/upload', {
        method: 'POST',
        body: formData
    });
    const result = await response.json();
    alert(result.message);
});

document.getElementById('viewFilesButton').addEventListener('click', async () => {
    const response = await fetch('/files');
    const files = await response.json();
    const fileList = document.getElementById('fileList');
    fileList.innerHTML = '';
    files.forEach(filename => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = `/download/${filename}`;
        link.innerText = filename;
        listItem.appendChild(link);
        fileList.appendChild(listItem);
    });
});