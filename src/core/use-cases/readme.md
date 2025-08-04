A) use-cases/
Qué son: Clases que hacen algo con esas entidades (ej: crear un usuario, borrar un producto).

Ejemplo:

```typescript
class CreateUser {
  constructor(private userRepository: UserRepository) {} // <- Dependencia abstracta

  async execute(name: string) {
    const user = new User("123", name);
    await this.userRepository.save(user); // <- No sabe CÓMO se guarda
    return user;
  }
}
```

No saben si usas MongoDB, Firebase o un archivo JSON. Solo dicen qué hacer.