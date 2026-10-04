// ============================================
// ЗАГРУЗКА И ОТОБРАЖЕНИЕ МАТЕРИАЛОВ ИЗ JSON
// ============================================

// Загрузка материалов из конкретного файла
async function loadMaterials(fileName) {
    try {
        const response = await fetch(`data/${fileName}`);
        if (!response.ok) throw new Error('Не удалось загрузить материалы');
        return await response.json();
    } catch (error) {
        console.error('Ошибка загрузки материалов:', error);
        return [];
    }
}

// Отрисовка спойлеров
function renderSpoilers(containerId, lessonsArray) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!lessonsArray || lessonsArray.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 40px;">Материалы ещё не добавлены учителем.</p>';
        return;
    }

    container.innerHTML = lessonsArray.map(lesson => `
        <div class="spoiler">
            <div class="spoiler-header" onclick="toggleSpoiler(this)">
                <div class="spoiler-title">
                    <span class="spoiler-icon">${lesson.icon || '📘'}</span>
                    <div class="spoiler-title-text">
                        <div class="spoiler-topic">${lesson.topic}</div>
                        <div class="spoiler-date">${lesson.date}</div>
                    </div>
                </div>
                <span class="spoiler-arrow">▼</span>
            </div>
            <div class="spoiler-content">
                <div class="spoiler-body">
                    ${renderContent(lesson.content, lesson.images)}
                </div>
            </div>
        </div>
    `).join('');
}

// Отрисовка содержимого спойлера
function renderContent(content, images) {
    let html = '';

    if (content.text) {
        html += `<div class="content-section">
            <h3>📝 Конспект</h3>
            <p>${content.text.replace(/\n/g, '<br>')}</p>
        </div>`;
    }

    if (content.presentation) {
        html += `<div class="content-section">
            <h3>📊 Презентация</h3>
            <div class="embed-container">
                <iframe src="${content.presentation}" allowfullscreen></iframe>
            </div>
        </div>`;
    }

    if (content.forms) {
        html += `<div class="content-section">
            <h3>📋 Тест / Задание</h3>
            <div class="embed-container">
                <iframe src="${content.forms}" allowfullscreen></iframe>
            </div>
        </div>`;
    }

    // Отрисовка изображений
    if (images && images.length > 0) {
        html += `<div class="content-section">
            <h3>📸 Материалы урока</h3>
            <div class="images-gallery">
                ${images.map(img => `
                    <div class="image-item">
                        <img src="data/images/7/${img.src}" alt="${img.alt}" loading="lazy" onclick="openImageModal(this)">
                        <p class="image-caption">${img.alt}</p>
                    </div>
                `).join('')}
            </div>
        </div>`;
    }

    if (content.links && content.links.length > 0) {
        html += `<div class="content-section">
            <h3> Полезные ссылки</h3>
            <ul>
                ${content.links.map(link => `<li><a href="${link.url}" target="_blank" rel="noopener">${link.title}</a></li>`).join('')}
            </ul>
        </div>`;
    }

    if (content.homework) {
        html += `<div class="content-section">
            <h3>🏠 Домашнее задание</h3>
            <p>${content.homework.replace(/\n/g, '<br>')}</p>
        </div>`;
    }

    return html || '<p style="color: var(--text-secondary);">Материалы урока будут добавлены позже</p>';
}

// Открытие/закрытие спойлера
function toggleSpoiler(header) {
    const spoiler = header.parentElement;
    spoiler.classList.toggle('open');
}

// Открытие изображения в модальном окне
function openImageModal(img) {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.onclick = () => modal.remove();
    
    const modalImg = document.createElement('img');
    modalImg.src = img.src;
    modalImg.alt = img.alt;
    
    modal.appendChild(modalImg);
    document.body.appendChild(modal);
}
