import { PhotographerRepository } from "@/core/use-cases/photographer/interfaces/PhotographerRepository";
import { Photographer } from "@/core/entities/photographer";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export class SupabasePhotographerRepository implements PhotographerRepository {
  private supabase: any;
  
  constructor() {}

  async findById(id: string): Promise<Photographer | null> {
    this.supabase = await createSupabaseServerClient();
    const { data, error } = await this.supabase
      .from("photographers")
      .select()
      .eq("id", id)
      .single();

    if (error) return null;

    return new Photographer(
      data.id,
      data.first_name,
      data.last_name,
      data.email,
      data.phone,
      data.address,
      data.city,
      data.state,
      data.country,
      data.logo_url,
      data.website_url,
      data.created_at,
      data.updated_at
    );

  }
}