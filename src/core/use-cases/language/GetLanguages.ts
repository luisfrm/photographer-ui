import { LanguageRepository } from "./interfaces/LanguageRepository";
import { Language } from "@/core/entities/language";

export class GetLanguages {
  constructor(private readonly languageRepository: LanguageRepository) {}

  async execute(): Promise<Language[]> {
    return this.languageRepository.findAll();
  }
}