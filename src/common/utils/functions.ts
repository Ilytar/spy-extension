function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getKeyValueFromStorage(key) {
    try {
        const result = await chrome.storage.local.get(key);
        // возвращает undefind, если нет ключа в хранилище
        return result[key];
    } catch (error) {
        console.error(error);
    }
}

async function setValueInStorage(key, value) {
    try {
        await chrome.storage.local.set({ [key]: value });
    } catch (error) {
        console.error(error, key, value);
    }
}

function getPercent(currentValue, maxValue) {
    currentValue = parseFloat(currentValue);
    maxValue = parseFloat(maxValue);

    if (isNaN(currentValue) || isNaN(maxValue) || maxValue === 0) {
        throw new Error("Ошибка: некорректные значения");
    }

    if (currentValue > maxValue) {
        throw new Error(
            "Ошибка: первое число должно быть меньше или равно второму числу"
        );
    }

    const percent = (currentValue / maxValue) * 100;
    const roundedPercent = Math.round(percent * 100) / 100;

    return roundedPercent;
}

export { sleep, getKeyValueFromStorage, setValueInStorage, getPercent };
