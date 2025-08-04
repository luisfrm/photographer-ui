import { NextResponse } from "next/server";
import { SupabasePhotographerRepository } from "@/core/infrastructure/supabase/PhotographerRepository";
import { GetPhotographer } from "@/core/use-cases/photographer/GetPhotographer";

export async function GET(request?: Request) {
  const id = process.env.NEXT_PUBLIC_PHOTOGRAPH_ID;
  if (!id) {
    return NextResponse.json({ error: "Missing photographer id" }, { status: 400 });
  }

  const photographerRepository = new SupabasePhotographerRepository();
  const getPhotographer = new GetPhotographer(photographerRepository);

  const photographer = await getPhotographer.execute(id);

  if (!photographer) {
    return NextResponse.json({ error: "Photographer not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: photographer.id,
    firstName: photographer.firstName,
    lastName: photographer.lastName,
    email: photographer.email,
    phone: photographer.phone,
    address: photographer.address,
    city: photographer.city,
    state: photographer.state,
    country: photographer.country,
    logoUrl: photographer.logoUrl,
    websiteUrl: photographer.websiteUrl,
    createdAt: photographer.createdAt,
    updatedAt: photographer.updatedAt,
    fullName: photographer.fullName,
    fullAddress: photographer.fullAddress,
    fullContact: photographer.fullContact,
  });
}
