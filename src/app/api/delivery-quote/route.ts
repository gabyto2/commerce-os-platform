import { calculateDeliveryFee } from "@/core/delivery";
import { getTenant } from "@/tenants";

export const runtime = "nodejs";

type PostalAddress = {
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
};

type ViaCepResponse = {
  cep?: string;
  uf?: string;
  localidade?: string;
  bairro?: string;
  logradouro?: string;
  erro?: boolean;
};

type BrasilApiResponse = {
  cep?: string;
  state?: string;
  city?: string;
  neighborhood?: string;
  street?: string;
};

type NominatimResult = {
  lat: string;
  lon: string;
  display_name?: string;
  address?: {
    house_number?: string;
    road?: string;
    suburb?: string;
    city?: string;
    town?: string;
    municipality?: string;
    state?: string;
    postcode?: string;
  };
};

type RouteResponse = {
  code?: string;
  routes?: Array<{ distance?: number; duration?: number }>;
};

function cleanCep(value: unknown): string {
  return typeof value === "string" ? value.replace(/\D/g, "") : "";
}

function cleanNumber(value: unknown): string {
  return typeof value === "string"
    ? value.trim().replace(/[^0-9A-Za-zÀ-ÿ\-/ ]/g, "").slice(0, 16)
    : "";
}

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .replace(/\s+/g, " ")
    .trim();
}

async function lookupCep(cep: string): Promise<PostalAddress> {
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 86_400 },
      signal: AbortSignal.timeout(8_000),
    });

    if (response.ok) {
      const data = (await response.json()) as ViaCepResponse;
      if (!data.erro && data.localidade && data.uf) {
        return {
          cep: cleanCep(data.cep ?? cep),
          state: data.uf,
          city: data.localidade,
          neighborhood: data.bairro ?? "",
          street: data.logradouro ?? "",
        };
      }
    }
  } catch {
    // Tenta a fonte alternativa abaixo.
  }

  const fallback = await fetch(`https://brasilapi.com.br/api/cep/v1/${cep}`, {
    headers: {
      Accept: "application/json",
      "User-Agent": "MeltBrownies/1.0 (https://melt-brownies.netlify.app)",
    },
    next: { revalidate: 86_400 },
    signal: AbortSignal.timeout(8_000),
  });

  if (!fallback.ok) throw new Error("CEP não encontrado. Confira os 8 números.");

  const data = (await fallback.json()) as BrasilApiResponse;
  if (!data.city || !data.state) throw new Error("CEP não encontrado.");

  return {
    cep: cleanCep(data.cep ?? cep),
    state: data.state,
    city: data.city,
    neighborhood: data.neighborhood ?? "",
    street: data.street ?? "",
  };
}

async function geocodeAddress(
  address: PostalAddress,
  number: string,
): Promise<{ coordinates: [number, number]; exactNumber: boolean; displayName: string }> {
  if (!address.street) {
    throw new Error(
      "Este CEP não identifica uma rua específica. Informe outro CEP ou fale com a equipe.",
    );
  }

  const query = [
    `${address.street}, ${number}`,
    address.neighborhood,
    address.city,
    address.state,
    address.cep,
    "Brasil",
  ]
    .filter(Boolean)
    .join(", ");

  const params = new URLSearchParams({
    q: query,
    format: "jsonv2",
    addressdetails: "1",
    limit: "5",
    countrycodes: "br",
  });

  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?${params.toString()}`,
    {
      headers: {
        Accept: "application/json",
        "Accept-Language": "pt-BR,pt;q=0.9",
        Referer: "https://melt-brownies.netlify.app/",
        "User-Agent": "MeltBrownies/1.0 (https://melt-brownies.netlify.app)",
      },
      next: { revalidate: 604_800 },
      signal: AbortSignal.timeout(10_000),
    },
  );

  if (!response.ok) throw new Error("Não foi possível consultar a localização agora.");

  const results = (await response.json()) as NominatimResult[];
  if (!results.length) {
    throw new Error(
      "Não foi possível localizar essa rua e número. Confira os dados ou solicite cotação pelo WhatsApp.",
    );
  }

  const requestedNumber = normalize(number).replace(/\s/g, "");
  const exact = results.find((result) => {
    const found = normalize(result.address?.house_number ?? "").replace(/\s/g, "");
    return Boolean(found) && found === requestedNumber;
  });
  const selected = exact ?? results[0];
  const longitude = Number(selected.lon);
  const latitude = Number(selected.lat);

  if (!Number.isFinite(longitude) || !Number.isFinite(latitude)) {
    throw new Error("A localização retornada para este endereço é inválida.");
  }

  return {
    coordinates: [longitude, latitude],
    exactNumber: Boolean(exact),
    displayName: selected.display_name ?? query,
  };
}

async function geocodeFreeText(query: string): Promise<[number, number]> {
  const params = new URLSearchParams({
    q: `${query}, Brasil`,
    format: "jsonv2",
    limit: "1",
    countrycodes: "br",
  });

  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?${params.toString()}`,
    {
      headers: {
        Accept: "application/json",
        "Accept-Language": "pt-BR,pt;q=0.9",
        Referer: "https://melt-brownies.netlify.app/",
        "User-Agent": "MeltBrownies/1.0 (https://melt-brownies.netlify.app)",
      },
      next: { revalidate: 2_592_000 },
      signal: AbortSignal.timeout(10_000),
    },
  );

  if (!response.ok) throw new Error("Não foi possível localizar o ponto de saída.");
  const results = (await response.json()) as NominatimResult[];
  const selected = results[0];
  if (!selected) throw new Error("Não foi possível localizar o ponto de saída.");

  const longitude = Number(selected.lon);
  const latitude = Number(selected.lat);
  if (!Number.isFinite(longitude) || !Number.isFinite(latitude)) {
    throw new Error("O ponto de saída retornado é inválido.");
  }

  return [longitude, latitude];
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { cep?: string; number?: string };
    const destinationCep = cleanCep(body.cep);
    const destinationNumber = cleanNumber(body.number);

    if (destinationCep.length !== 8) {
      return Response.json(
        { error: "Informe um CEP válido com 8 números." },
        { status: 400 },
      );
    }

    if (!destinationNumber) {
      return Response.json(
        { error: "Informe o número do endereço para calcular a rota corretamente." },
        { status: 400 },
      );
    }

    const tenant = getTenant();
    const destination = await lookupCep(destinationCep);

    if (
      normalize(destination.city) !== normalize(tenant.contact.city) ||
      destination.state.toUpperCase() !== tenant.contact.region.toUpperCase()
    ) {
      return Response.json(
        { error: `A entrega automática está disponível somente em ${tenant.contact.city}.` },
        { status: 422 },
      );
    }

    const [originCoordinates, destinationLocation] = await Promise.all([
      geocodeFreeText(tenant.operation.deliveryPricing.origin.address),
      geocodeAddress(destination, destinationNumber),
    ]);

    const [originLongitude, originLatitude] = originCoordinates;
    const [destinationLongitude, destinationLatitude] =
      destinationLocation.coordinates;

    const routeUrl =
      "https://router.project-osrm.org/route/v1/driving/" +
      `${originLongitude},${originLatitude};` +
      `${destinationLongitude},${destinationLatitude}` +
      "?overview=false&alternatives=false&steps=false";

    const routeResponse = await fetch(routeUrl, {
      headers: {
        Accept: "application/json",
        "User-Agent": "MeltBrownies/1.0 (https://melt-brownies.netlify.app)",
      },
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });

    if (!routeResponse.ok) throw new Error("Não foi possível calcular a rota agora.");

    const routeData = (await routeResponse.json()) as RouteResponse;
    const route = routeData.routes?.[0];
    if (routeData.code !== "Ok" || !route?.distance) {
      throw new Error("Não foi encontrada uma rota de carro para esse endereço.");
    }

    const distanceKm = Math.round((route.distance / 1000) * 10) / 10;
    const fee = calculateDeliveryFee(
      distanceKm,
      tenant.operation.deliveryPricing.bands,
    );

    if (fee === null || distanceKm > tenant.operation.deliveryPricing.maxDistanceKm) {
      return Response.json(
        {
          error: "O endereço está fora da faixa automática. Solicite uma cotação manual.",
          distanceKm,
          manualQuote: true,
        },
        { status: 422 },
      );
    }

    const formattedAddress = [
      `${destination.street}, ${destinationNumber}`,
      destination.neighborhood,
      `${destination.city} — ${destination.state}`,
      destination.cep,
    ]
      .filter(Boolean)
      .join(", ");

    return Response.json({
      cep: destination.cep,
      number: destinationNumber,
      city: destination.city,
      state: destination.state,
      neighborhood: destination.neighborhood,
      street: destination.street,
      formattedAddress,
      distanceKm,
      durationMinutes: route.duration
        ? Math.max(1, Math.round(route.duration / 60))
        : null,
      fee,
      exactNumber: destinationLocation.exactNumber,
      estimated: true,
      disclaimer: destinationLocation.exactNumber
        ? "Rota calculada usando o CEP e o número informados. A equipe confirma o acesso e o prazo."
        : "O número foi usado na busca, mas o mapa não confirmou o ponto exato. A equipe pode ajustar a taxa antes de aceitar o pedido.",
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Não foi possível calcular a entrega.";
    return Response.json({ error: message }, { status: 500 });
  }
}
