# Security System

Цей модуль надає комплексну систему безпеки для захисту додатку від різних типів атак.

## Компоненти безпеки

### 1. DOM Sanitization (Захист від XSS)

**Файл:** `src/utils/security/domSanitizer.ts`

Захищає від Cross-Site Scripting (XSS) атак через санітизацію HTML контенту.

```tsx
import { sanitizeHTML, sanitizeText, sanitizeURL } from '@/utils/security';

// Санітизація HTML
const safeHTML = sanitizeHTML('<script>alert("xss")</script><p>Safe content</p>');
// Результат: '<p>Safe content</p>'

// Санітизація тексту
const safeText = sanitizeText('<script>alert("xss")</script>');
// Результат: 'alert("xss")'

// Санітизація URL
const safeURL = sanitizeURL('javascript:alert("xss")');
// Результат: '' (порожній рядок)
```

### 2. Secure Storage (Безпечне зберігання)

**Файл:** `src/utils/security/secureStorage.ts`

Забезпечує безпечне зберігання чутливих даних з шифруванням.

```tsx
import { secureStorage } from '@/utils/security';

// Зберігання токена
secureStorage.setToken('jwt-token-here');

// Отримання токена
const token = secureStorage.getToken();

// Видалення токена
secureStorage.removeToken();

// Перевірка наявності токена
const hasToken = secureStorage.hasToken();
```

### 3. CSRF Protection (Захист від CSRF)

**Файл:** `src/utils/security/csrfProtection.ts`

Захищає від Cross-Site Request Forgery атак.

```tsx
import { csrfProtection } from '@/utils/security';

// Генерація CSRF токена
const token = csrfProtection.generateToken();

// Отримання заголовків для API запитів
const headers = csrfProtection.getCSRFHeader();
// Результат: { 'X-CSRF-Token': 'generated-token' }

// Валідація токена
const isValid = csrfProtection.validateToken(token);
```

### 4. Input Sanitization (Санітизація введення)

**Файл:** `src/utils/security/inputSanitizer.ts`

Санітизує користувацьке введення для запобігання ін'єкціям.

```tsx
import { InputSanitizer } from '@/utils/security';

// Санітизація email
const safeEmail = InputSanitizer.sanitizeEmail('user@example.com<script>');

// Санітизація імені
const safeName = InputSanitizer.sanitizeName('John<script>alert("xss")</script>');

// Санітизація форми
const sanitizedForm = InputSanitizer.sanitizeFormData({
  email: 'user@example.com',
  name: 'John<script>alert("xss")</script>',
  phone: '+380501234567'
});
```

### 5. SafeHTML Component

**Файл:** `src/components/SafeHTML/SafeHTML.tsx`

Безпечний компонент для відображення HTML контенту.

```tsx
import { SafeHTML } from '@/components/SafeHTML';

const MyComponent = () => {
  const userContent = '<p>User content</p><script>alert("xss")</script>';
  
  return (
    <SafeHTML 
      html={userContent}
      className="user-content"
      tag="div"
    />
  );
};
```

## Інтеграція з API

### Автоматична санітизація запитів

**Файл:** `src/api/base.ts`

Всі API запити автоматично санітизуються та включають CSRF захист.

```tsx
// Автоматично додаються:
// - Authorization header з JWT токеном
// - X-CSRF-Token header для POST/PUT/DELETE запитів
// - Санітизація даних запиту
```

## Безпечні заголовки

**Файл:** `public/index.html`

Додано безпечні HTTP заголовки:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Content-Security-Policy` - комплексна політика безпеки

## Скрипти безпеки

Додано npm скрипти для аудиту безпеки:

```bash
# Аудит залежностей
npm run audit

# Виправлення вразливостей
npm run audit:fix

# Перевірка безпеки
npm run security:check

# Оновлення залежностей
npm run security:update
```

## Найкращі практики

### 1. Завжди санітизуйте користувацьке введення

```tsx
// ✅ Добре
const safeInput = InputSanitizer.sanitizeText(userInput);

// ❌ Погано
const unsafeInput = userInput; // Може містити XSS
```

### 2. Використовуйте SafeHTML для відображення HTML

```tsx
// ✅ Добре
<SafeHTML html={userContent} />

// ❌ Погано
<div dangerouslySetInnerHTML={{ __html: userContent }} />
```

### 3. Зберігайте токени безпечно

```tsx
// ✅ Добре
secureStorage.setToken(token);

// ❌ Погано
localStorage.setItem('token', token);
```

### 4. Регулярно перевіряйте залежності

```bash
# Щотижнева перевірка
npm run security:check
```

## Типи атак та захист

### XSS (Cross-Site Scripting)
- **Захист:** DOM санітизація, CSP заголовки
- **Інструменти:** DOMPurify, InputSanitizer

### CSRF (Cross-Site Request Forgery)
- **Захист:** CSRF токени, SameSite cookies
- **Інструменти:** csrfProtection

### Injection Attacks
- **Захист:** Валідація введення, санітизація
- **Інструменти:** InputSanitizer, Yup схеми

### Token Theft
- **Захист:** Шифрування, sessionStorage
- **Інструменти:** secureStorage

## Конфігурація

### Змінні середовища

```env
# Ключ для шифрування (змініть в продакшені!)
REACT_APP_STORAGE_KEY=your-secure-encryption-key

# API конфігурація
REACT_APP_API_BASEURL=https://api.example.com
```

### CSP налаштування

Налаштуйте Content Security Policy в `public/index.html` відповідно до ваших потреб.

## Моніторинг

### Логування безпеки

Всі операції безпеки логуються в консоль для відлагодження:

```tsx
console.error('HTML sanitization failed:', error);
console.error('Encryption failed:', error);
```

### Аудит залежностей

Регулярно запускайте:

```bash
npm audit
npm outdated
```

## Висновок

Ця система безпеки забезпечує:

1. **Захист від XSS** - через DOM санітизацію
2. **Захист від CSRF** - через токени
3. **Безпечне зберігання** - через шифрування
4. **Валідацію введення** - через санітизацію
5. **Безпечні заголовки** - через CSP та інші заголовки
6. **Моніторинг** - через аудит залежностей

Система готова до використання в продакшені та відповідає сучасним стандартам безпеки веб-додатків. 