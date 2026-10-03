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
            classId: normalizedLogin
        };
    }
    
    return { success: false, message: 'Неверный пароль' };
}

function saveSession(classId, className) {
    const sessionData = {
        classId: classId,
        className: className,
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

function requireAuth() {
    const auth = checkAuth();
    if (!auth) {
        window.location.href = 'login.html';
        return null;
    }
    return auth;
}

// ⭐ НОВАЯ ФУНКЦИЯ: Редирект на страницу класса
function redirectToClassPage(classId) {
    const classNumber = classId.replace(/[^0-9]/g, ''); // Извлекаем число: "7a" → "7"
    const targetPage = `materials-${classNumber}.html`;
    window.location.href = targetPage;
}

function logout() {
    sessionStorage.removeItem('auth');
    window.location.href = 'login.html';
}
