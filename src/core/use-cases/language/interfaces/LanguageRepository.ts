import { Language } from "@/core/entities/language";

export interface LanguageRepository {
  findAll(): Promise<Language[]>;
  findByCode(code: string): Promise<Language | null>;
}