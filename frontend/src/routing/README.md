# Advanced Routing Capabilities

Цей модуль надає розширені можливості для роботи з роутингом в React додатку.

## Компоненти

### RouterProvider
Дозволяє вибирати між `BrowserRouter` та `HashRouter` на основі конфігурації.

```tsx
import { RouterProvider } from '@/routing';

// Використання BrowserRouter (за замовчуванням)
<RouterProvider>
  <App />
</RouterProvider>

// Використання HashRouter
<RouterProvider useHashRouter={true}>
  <App />
</RouterProvider>
```

### ProtectedRoute
Компонент для захисту маршрутів, що потребують авторизації.

```tsx
import { ProtectedRoute } from '@/routing';

<Route element={<ProtectedRoute />}>
  <Route path="/dashboard" element={<Dashboard />} />
</Route>
```

### NotFoundPage
Сторінка 404 для обробки неіснуючих маршрутів.

```tsx
import { NotFoundPage } from '@/routing';

<Route path="*" element={<NotFoundPage />} />
```

## Хуки

### useNavigationGuard
Хук для запобігання небажаним переходам між сторінками.

```tsx
import { useNavigationGuard } from '@/routing';

const MyComponent = () => {
  const { safeNavigate } = useNavigationGuard({
    enabled: true,
    message: 'У вас є незбережені зміни. Продовжити?',
    onBeforeNavigate: () => {
      // Повертає true якщо можна перейти, false якщо потрібно заблокувати
      return !hasUnsavedChanges;
    }
  });

  return (
    <button onClick={() => safeNavigate('/next-page')}>
      Перейти далі
    </button>
  );
};
```

### useAsyncRedirect
Хук для обробки асинхронних редиректів після дій.

```tsx
import { useAsyncRedirect } from '@/routing';

const MyComponent = () => {
  const { handleAsyncAction, redirectToHome } = useAsyncRedirect({
    onSuccess: (data) => console.log('Success:', data),
    onError: (error) => console.error('Error:', error)
  });

  const handleSubmit = async () => {
    await handleAsyncAction(
      async () => {
        // Виконуємо асинхронну дію
        const result = await api.createItem(data);
        return result;
      },
      '/success-page', // Куди перенаправити після успіху
      (result) => {
        // Додаткові дії після успіху
        console.log('Item created:', result);
      }
    );
  };

  return (
    <button onClick={handleSubmit}>
      Створити
    </button>
  );
};
```

## Конфігурація

### Використання HashRouter
Додайте в `.env` файл:
```
REACT_APP_USE_HASH_ROUTER=true
```

### Різниця між BrowserRouter та HashRouter

**BrowserRouter (HTML5 History Mode):**
- Використовує HTML5 History API
- Красиві URL без хешів
- Потребує налаштування сервера для SPA
- Кращий для SEO

**HashRouter:**
- Використовує хеш в URL (#)
- Працює на будь-якому сервері
- Простіший в налаштуванні
- Менш дружній до SEO

## Приклади використання

### Захист маршрутів з різними рівнями доступу
```tsx
// Базовий захист
<Route element={<ProtectedRoute />}>
  <Route path="/dashboard" element={<Dashboard />} />
</Route>

// Захист з перевіркою ролі
<Route element={<ProtectedRoute requiredRole="admin" />}>
  <Route path="/admin" element={<AdminPanel />} />
</Route>
```

### Обробка асинхронних дій з редиректами
```tsx
const { handleAsyncAction } = useAsyncRedirect();

const handleLogin = async (credentials) => {
  await handleAsyncAction(
    async () => await api.login(credentials),
    '/dashboard',
    (user) => {
      // Зберігаємо токен
      localStorage.setItem('token', user.token);
    }
  );
};
```

### Навігаційний гвард для форм
```tsx
const { safeNavigate } = useNavigationGuard({
  onBeforeNavigate: () => {
    // Перевіряємо чи є незбережені зміни
    return !formik.dirty;
  }
});
```

## Найкращі практики

1. **Завжди використовуйте catch-all маршрут** для обробки 404 помилок
2. **Використовуйте навігаційні гварди** для форм з незбереженими змінами
3. **Централізуйте логіку редиректів** через `useAsyncRedirect`
4. **Налаштуйте правильний роутер** для вашого середовища розгортання
5. **Використовуйте типи** для маршрутів через `routes` об'єкт 