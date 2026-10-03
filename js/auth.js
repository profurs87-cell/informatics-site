// ============================================
// АВТОРИЗАЦИЯ С ПЕРЕНАПРАВЛЕНИЕМ НА СТРАНИЦУ ПАРАЛЛЕЛИ
// ============================================

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

function verifyCredentials(classesData, inputLogin, inputPassword) {
    const normalizedLogin = inputLogin.trim().toLowerCase();
    const classInfo = classesData[normalizedLogin];
    
    if (!classInfo) {
        return { success: false, message: 'Класс с таким логином не найден' };
    }
    
    if (inputPassword.trim() === classInfo.password) {
        return { 
            success: true, 
            className: classInfo.name,
            classId: normalizedLogin,
            page: classInfo.page
        };
    }
    
    return { success: false, message: 'Неверный пароль' };
}

function saveSession(classId, className, page) {
    const sessionData = {
        classId: classId,
        className: className,
        page: page,
        loginTime: new Date().toISOString()
    };
    sessionStorage.setItem('auth', JSON.stringify(sessionData));
}

function checkAuth() {
    const auth = sessionStorage.getItem('auth');
    if (!auth) return null;
    try {
        return JSON.parse(auth);
    } catch (e) {
        return null;
    }
}

// Проверка авторизации + соответствие класса странице
function requireAuth(expectedPage) {
    const auth = checkAuth();
    
    if (!auth) {
        window.location.href = 'login.html';
        return null;
    }
    
    // Проверяем, что класс имеет доступ к этой странице
    if (auth.page !== expectedPage) {
        // Перенаправляем на правильную страницу
        window.location.href = auth.page;
        return null;
    }
    
    return auth;
}

function logout() {
    sessionStorage.removeItem('auth');
    window.location.href = 'login.html';
}
