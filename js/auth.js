// ============================================
// АВТОРИЗАЦИЯ ПО КОДАМ КЛАССОВ
// ============================================

// Загрузка списка классов из JSON
async function loadClasses() {
    try {
        const response = await fetch('data/classes.json');
        if (!response.ok) throw new Error('Не удалось загрузить данные');
        return await response.json();
    } catch (error) {
        console.error('Ошибка загрузки классов:', error);
        return null;
    }
}

// Проверка введённого кода
function verifyCode(classesData, classId, inputCode) {
    const classInfo = classesData[classId];
    if (!classInfo) return { success: false, message: 'Класс не найден' };
    
    const normalizedInput = inputCode.trim().toUpperCase();
    const normalizedCode = classInfo.code.trim().toUpperCase();
    
    if (normalizedInput === normalizedCode) {
        return { 
            success: true, 
            className: classInfo.name 
        };
    }
    return { success: false, message: 'Неверный код доступа' };
}

// Сохранение сессии ученика
function saveSession(classId, className) {
    const sessionData = {
        classId: classId,
        className: className,
        loginTime: new Date().toISOString()
    };
    sessionStorage.setItem('auth', JSON.stringify(sessionData));
}

// Проверка: авторизован ли пользователь
function checkAuth() {
    const auth = sessionStorage.getItem('auth');
    if (!auth) return null;
    try {
        return JSON.parse(auth);
    } catch (e) {
        return null;
    }
}

// Требовать авторизацию (для защищённых страниц)
function requireAuth() {
    const auth = checkAuth();
    if (!auth) {
        window.location.href = 'login.html';
        return null;
    }
    return auth;
}

// Выход
function logout() {
    sessionStorage.removeItem('auth');
    window.location.href = 'index.html';
}

// Получить класс из URL (например, login.html?class=7a)
function getClassFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('class');
}