import path from 'path';
import fs from 'fs-extra';


// Путь к JSON-файлу
const dataFilePath = path.resolve('./DB.json');

async function checkConnection(){
    try {
        if (await fs.pathExists(dataFilePath)) {
            await fs.readJson(dataFilePath);
        }
    } catch (error) {
        console.error('Ошибка загрузки данных из файла:', error);
    }
};

async function createUserIfNotExist(userId, newUserData) {
    try {
        const usersData = await fs.readJson(dataFilePath);

        if (!usersData[userId]) {
            usersData[userId] = newUserData;
            await fs.writeFile(dataFilePath, JSON.stringify(usersData, null, 2));
            console.log(`Создан новый пользователь с ID: ${userId}`);
        } else {
            console.log(`Пользователь с ID: ${userId} уже существует.`);
        }
    } catch (error) {
        console.error('Ошибка обработки данных:', error);
    }
}

async function saveUsersData(usersData) {
    try {
        await fs.writeFile(dataFilePath, JSON.stringify(usersData, null, 2));

    } catch (error) {
        console.error('Ошибка сохранения данных в файл:', error);
    }
}

async function isCounterExist(userId) {
    try {
        const DB = await fs.readJson(dataFilePath);

        if (DB[userId].counter === undefined || DB[userId].counter === null) {

            DB[userId].counter = 0;

            // Сохраняем обновлённые данные целиком
            await fs.writeFile(dataFilePath, JSON.stringify(DB, null, 2));

            console.log(`Создано новое поле counter для пользователя с ID: ${userId}`);
        }
    } catch (error) {
        console.error('Ошибка обработки данных:', error);
    }
}

async function getCurrentValue(userId, propertyName) {
    const DB = await fs.readJson(dataFilePath);
    return DB[userId]?.[propertyName];
}

export {saveUsersData, checkConnection, createUserIfNotExist, isCounterExist, getCurrentValue}