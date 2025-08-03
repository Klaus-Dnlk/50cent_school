# IndexedDB Service

Цей сервіс надає функціональність для роботи з IndexedDB в проєкті
50cent_school.

## Можливості

- **Кешування кредитів та інвестицій** - зберігання даних для офлайн-доступу
- **Офлайн-функціональність** - робота без інтернету
- **Кешування API відповідей** - зменшення кількості запитів
- **Зберігання офлайн форм** - для подальшої синхронізації
- **Автоматична очистка застарілих даних** - TTL для кешу

## Структура бази даних

### Stores

1. **credits** - зберігання кредитів

   - Індекси: `by-date`

2. **investments** - зберігання інвестицій

   - Індекси: `by-user`, `by-date`

3. **user_data** - дані користувача

   - Індекси: `by-type`

4. **cache** - кеш API відповідей

   - Індекси: `by-url`, `by-date`
   - TTL: 5 хвилин за замовчуванням

5. **offline_forms** - офлайн форми
   - Індекси: `by-type`, `by-date`

## Використання

### Базовий приклад

```typescript
import { indexedDBService } from '@/services/indexedDB';

// Ініціалізація
await indexedDBService.init();

// Зберігання кредитів
await indexedDBService.storeCredits(creditsData);

// Отримання кредитів
const credits = await indexedDBService.getCredits();

// Кешування API відповіді
await indexedDBService.cacheResponse('/api/credits', responseData, 300000);

// Отримання кешованої відповіді
const cached = await indexedDBService.getCachedResponse('/api/credits');
```

### Використання з React Hook

```typescript
import { useIndexedDB } from '@/hooks/useIndexedDB';

function MyComponent() {
  const {
    isInitialized,
    isLoading,
    error,
    storeCredits,
    getCredits,
    cacheResponse,
    getCachedResponse,
  } = useIndexedDB();

  useEffect(() => {
    if (isInitialized) {
      loadData();
    }
  }, [isInitialized]);

  const loadData = async () => {
    const credits = await getCredits();
    // Використання даних
  };

  return (
    <div>
      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {/* Ваш компонент */}
    </div>
  );
}
```

### Використання з кешуванням API

```typescript
import { useCreditsWithCache } from '@/hooks/credits/useCreditsWithCache';

function CreditsComponent() {
  const {
    data: credits,
    isLoading,
    isOffline,
    refresh,
    prefetchNextPage,
  } = useCreditsWithCache({
    page: 1,
    pageSize: 10,
    enableCache: true,
  });

  return (
    <div>
      {isOffline && <div>Offline mode - showing cached data</div>}
      {credits.map((credit) => (
        <div key={credit.id}>{credit.title}</div>
      ))}
    </div>
  );
}
```

## Офлайн синхронізація

```typescript
import { offlineSyncService } from '@/services/offlineSync';

// Зберігання форми для офлайн відправки
await offlineSyncService.storeOfflineForm('credit_application', formData);

// Синхронізація всіх офлайн форм
const result = await offlineSyncService.syncPendingForms();
console.log(`Synced: ${result.synced}, Failed: ${result.failed}`);

// Отримання статусу синхронізації
const status = await offlineSyncService.getSyncStatus();
console.log(`Pending forms: ${status.pending}, Online: ${status.isOnline}`);
```

## Демонстраційний компонент

```typescript
import { IndexedDBDemo } from '@/components/IndexedDBDemo';

function DemoPage() {
  return (
    <div>
      <h1>IndexedDB Demo</h1>
      <IndexedDBDemo />
    </div>
  );
}
```

## Переваги

1. **Продуктивність** - швидкий доступ до даних
2. **Офлайн-функціональність** - робота без інтернету
3. **Зменшення навантаження на сервер** - кешування запитів
4. **Кращий UX** - миттєве завантаження кешованих даних
5. **Надійність** - збереження форм при втраті з'єднання

## Технічні деталі

- Використовує бібліотеку `idb` для зручної роботи з IndexedDB
- Підтримує TypeScript з повною типізацією
- Автоматична очистка застарілих даних
- Обробка помилок та fallback механізми
- Інтеграція з React Query для кешування
