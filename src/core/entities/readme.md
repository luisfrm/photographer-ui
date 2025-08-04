A) entities/
Qué son: Clases que definen qué es un objeto en tu negocio (ej: un User con id, name, email).

Ejemplo:

```typescript
class User {
  constructor(public id: string, public name: string) {}
}
```

Solo guardan datos y validaciones básicas (ej: if (name.length > 0)).