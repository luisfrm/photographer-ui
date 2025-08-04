infrastructure/
Qué son: Implementaciones reales de lo que definiste en el core (ej: cómo guardar en MongoDB).

Ejemplo:

```typescript
class MongoUserRepository implements UserRepository {
  async save(user: User) {
    console.log("Guardando en MongoDB...", user);
    // Código real: await db.collection('users').insertOne(user);
  }
}
```