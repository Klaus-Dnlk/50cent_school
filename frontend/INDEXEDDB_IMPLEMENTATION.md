# IndexedDB Implementation в 50cent_school

Цей документ описує реалізацію IndexedDB технології та бібліотеки `idb` в
проєкті 50cent_school.

## Що було додано

### 1. **IndexedDB Service** (`/src/services/indexedDB/`)

- Повнофункціональний сервіс для роботи з IndexedDB
- Підтримка 5 основних stores: credits, investments, user_data, cache,
  offline_forms
- Автоматична очистка застарілих даних (TTL)
- Типізація TypeScript

### 2. **React Hook** (`/src/hooks/useIndexedDB.ts`)

- Зручний хук для роботи з IndexedDB в React компонентах
- Обробка станів завантаження та помилок
- Автоматична ініціалізація

### 3. **Кешований API** (`/src/api/credit/getCredits/getAllCreditsWithCache.api.ts`)

- API з вбудованим кешуванням
- Автоматичне збереження відповідей в IndexedDB
- Fallback на кеш при відсутності інтернету

### 4. **Офлайн синхронізація** (`/src/services/offlineSync/`)

- Сервіс для синхронізації офлайн форм
- Автоматична синхронізація при відновленні з'єднання
- Retry механізм з максимальною кількістю спроб

### 5. **Демонстраційні компоненти**

- `IndexedDBDemo` - повна демонстрація функціональності
- `CreditScreenWithOffline` - покращений компонент з офлайн підтримкою
- `SyncStatus` - компонент для відображення статусу синхронізації

## Як використовувати

### 1. **Базове використання**

```typescript
import { useIndexedDB } from '@/hooks/useIndexedDB';

function MyComponent() {
  const { isInitialized, storeCredits, getCredits } = useIndexedDB();

  const handleStoreData = async () => {
    await storeCredits([{ id: 1, title: 'Credit 1' }]);
  };

  const handleLoadData = async () => {
    const credits = await getCredits();
    console.log(credits);
  };

  return (
    <div>
      {isInitialized && (
        <>
          <button onClick={handleStoreData}>Store Data</button>
          <button onClick={handleLoadData}>Load Data</button>
        </>
      )}
    </div>
  );
}
```

### 2. **Кешований API**

```typescript
import { useCreditsWithCache } from '@/hooks/credits/useCreditsWithCache';

function CreditsList() {
  const { data, isLoading, isOffline, refresh } = useCreditsWithCache({
    page: 1,
    pageSize: 10,
    enableCache: true,
  });

  return (
    <div>
      {isOffline && <div>Offline mode - showing cached data</div>}
      {data.map((credit) => (
        <div key={credit.id}>{credit.title}</div>
      ))}
    </div>
  );
}
```

### 3. **Офлайн форми**

```typescript
import { offlineSyncService } from '@/services/offlineSync';

// Зберігання форми
await offlineSyncService.storeOfflineForm('credit_application', formData);

// Синхронізація
const result = await offlineSyncService.syncPendingForms();
console.log(`Synced: ${result.synced}, Failed: ${result.failed}`);
```

### 4. **Демонстрація**

Відкрийте `/credit/demo` для перегляду повної демонстрації функціональності.

## Маршрути для тестування

- `/credit` - оригінальний компонент
- `/credit/offline` - компонент з офлайн підтримкою
- `/credit/demo` - демонстрація IndexedDB

## Переваги реалізації

### 1. **Продуктивність**

- Швидкий доступ до кешованих даних
- Зменшення кількості API запитів
- Миттєве завантаження при повторних відвідуваннях

### 2. **Офлайн-функціональність**

- Робота без інтернету
- Збереження форм для подальшої відправки
- Автоматична синхронізація при відновленні з'єднання

### 3. **Надійність**

- Fallback механізми при помилках
- Retry логіка для офлайн форм
- Обробка помилок на всіх рівнях

### 4. **UX покращення**

- Індикатори онлайн/офлайн статусу
- Прогрес синхронізації
- Прозорість для користувача

## Технічні деталі

### Структура бази даних

```typescript
interface DatabaseSchema {
  credits: { key: string; value: any; indexes: { 'by-date': Date } };
  investments: {
    key: string;
    value: any;
    indexes: { 'by-user': string; 'by-date': Date };
  };
  user_data: { key: string; value: any; indexes: { 'by-type': string } };
  cache: {
    key: string;
    value: any;
    indexes: { 'by-url': string; 'by-date': Date };
  };
  offline_forms: {
    key: string;
    value: any;
    indexes: { 'by-type': string; 'by-date': Date };
  };
}
```

### Кеш TTL

- API відповіді: 5 хвилин
- Кредити: без обмежень
- Офлайн форми: без обмежень

### Автоматична очистка

- Застарілі кеш записи видаляються автоматично
- Можна викликати `clearExpiredCache()` вручну

## Встановлення залежностей

```bash
npm install idb
```

## Підтримувані браузери

- Chrome 58+
- Firefox 57+
- Safari 10.1+
- Edge 79+

## Майбутні покращення

1. **Service Worker** - для повної офлайн функціональності
2. **Push Notifications** - для сповіщень про синхронізацію
3. **Background Sync** - для автоматичної синхронізації
4. **Conflict Resolution** - для вирішення конфліктів даних
5. **Data Compression** - для зменшення розміру збережених даних
