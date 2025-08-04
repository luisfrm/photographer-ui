import { PhotographerRepository } from "./interfaces/PhotographerRepository";
import { Photographer } from "@/core/entities/photographer";

export class GetPhotographer {
  constructor(private readonly photographerRepository: PhotographerRepository) {}

  async execute(id: string): Promise<Photographer | null> {
    return this.photographerRepository.findById(id);
  }
}