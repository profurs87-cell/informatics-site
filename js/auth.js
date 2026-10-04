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

function findClassByLogin(classesData, inputLogin) {
    const normalizedLogin = inputLogin.trim().toLowerCase();

    for (const key in classesData) {
        const classInfo = classesData[key];
        if (classInfo.login && classInfo.login.toLowerCase() === normalizedLogin) {
            return { key: key, info: classInfo };
        }
    }
    return null;
}

function verifyCredentials(classesData, inputLogin, inputPassword) {
    const found = findClassByLogin(classesData, inputLogin);

    if (!found) {
        return { success: false, message: 'Класс с таким логином не найден' };
    }

    const classInfo = found.info;

    if (inputPassword.trim() === classInfo.password) {
        return {
            success: true,
            className: classInfo.name,
            classId: found.key,
            page: classInfo.page,
            materialsFile: classInfo.materialsFile  // ⭐ ВАЖНО: сохраняем имя файла!
        };
    }

    return { success: false, message: 'Неверный пароль' };
}

function saveSession(classId, className, page, materialsFile) {
    const sessionData = {
        classId: classId,
        className: className,
        page: page,
        materialsFile: materialsFile,  // ⭐ ВАЖНО: сохраняем файл!
        loginTime: new Date().toISOString()
    };
    sessionStorage.setItem('auth', JSON.stringify(sessionData));
    console.log('✅ Сессия сохранена:', sessionData);
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

function requireAuth(expectedPage) {
    const auth = checkAuth();

    if (!auth) {
        window.location.href = 'login.html';
        return null;
    }

    if (auth.page !== expectedPage) {
        window.location.href = auth.page;
        return null;
    }

    return auth;
}

function logout() {
    sessionStorage.removeItem('auth');
    window.location.href = 'login.html';
}
