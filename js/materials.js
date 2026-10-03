// ============================================
// ЗАГРУЗКА И ОТОБРАЖЕНИЕ МАТЕРИАЛОВ ИЗ JSON
// ============================================

let materialsData = null;

// Загрузка материалов из JSON
async function loadMaterials() {
    try {
        const response = await fetch('data/materials.json');
        if (!response.ok) throw new Error('Не удалось загрузить материалы');
        return await response.json();
    } catch (error) {
        console.error('Ошибка загрузки материалов:', error);
        return null;
    }
}

// Получение материалов для конкретного класса
function getClassMaterials(className) {
    if (!materialsData || !materialsData[className]) {
        return [];
    }
    return materialsData[className];
}

// Отрисовка спойлеров
function renderSpoilers(containerId, className) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const lessons = getClassMaterials(className);
    
    if (lessons.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 40px;">Материалы ещё не добавлены</p>';
        return;
    }

    container.innerHTML = lessons.map(lesson => `
        <div class="spoiler">
            <div class="spoiler-header" onclick="toggleSpoiler(this)">
                <div class="spoiler-title">
                    <span class="spoiler-icon">${lesson.icon}</span>
                    <div>
                        <div>${lesson.topic}</div>
                        <div style="font-size: 12px; color: var(--text-secondary); margin-top: 4px;">${lesson.date}</div>
                    </div>
                </div>
                <span class="spoiler-arrow">▼</span>
            </div>
            <div class="spoiler-content">
                <div class="spoiler-body">
                    ${renderContent(lesson.content)}
                </div>
            </div>
        </div>
    `).join('');
}

// Отрисовка содержимого спойлера
function renderContent(content) {
    let html = '';

    // Текст
    if (content.text) {
        html += `<div class="content-section">
            <h3>📝 Конспект</h3>
            <p>${content.text.replace(/\n/g, '<br>')}</p>
        </div>`;
    }

    // Презентация (iframe)
    if (content.presentation) {
        html += `<div class="content-section">
            <h3>📊 Презентация</h3>
            <div class="embed-container">
                <iframe src="${content.presentation}" allowfullscreen></iframe>
            </div>
        </div>`;
    }

    // Формы (Google Forms, Яндекс Формы)
    if (content.forms) {
        html += `<div class="content-section">
            <h3>📋 Тест/Задание</h3>
            <div class="embed-container">
                <iframe src="${content.forms}" allowfullscreen></iframe>
            </div>
        </div>`;
    }

    // Ссылки
    if (content.links && content.links.length > 0) {
        html += `<div class="content-section">
            <h3>🔗 Полезные ссылки</h3>
            <ul>
                ${content.links.map(link => `<li><a href="${link.url}" target="_blank">${link.title}</a></li>`).join('')}
            </ul>
        </div>`;
    }

    // Домашнее задание
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